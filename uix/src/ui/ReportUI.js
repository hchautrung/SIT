import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  Select, Card, Button, DatePicker } from 'antd';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import api from '../utils/api';

import {AgGridReact} from '@ag-grid-community/react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";

import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";

import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import "@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css";

const { RangePicker } = DatePicker;

const apiURL = "http://localhost:8282";
const isRichFeature = true;

const ReportUI =  props => {
    const navigate = useNavigate();
    const { userInfo, loading, error: userError } = useSelector((state) => state.userSignIn);
    if(!userInfo) navigate('/signin');
    
    const [fetching, setFetching] = useState(false);

    /* Grid Configurations */
    const gridModules = [
        ClientSideRowModelModule,
        CsvExportModule,
        ...((isRichFeature && [ColumnsToolPanelModule]) || []), /* add [] to avoid the error TypeError: false is not iterable */
        ...((isRichFeature && [FiltersToolPanelModule]) || []),
        ...((isRichFeature && [RowGroupingModule]) || []),
        ...((isRichFeature && [ExcelExportModule]) || [])
    ];
    const gridRef = useRef();
    const columnDefs = [
        { headerName: "Exercise", field: 'exercise_routine', ...(isRichFeature && {enableRowGroup: true}), ...(isRichFeature && {rowGroup: true}), ...(isRichFeature && {hide: true})},
        { headerName: "Date & Time", field: 'datetime' },
        { headerName: "Duration", field: 'duration', ...(isRichFeature && {enableValue: true}), ...(isRichFeature && {allowedAggFuncs: ['sum']}), aggFunc: 'sum'}
    ];
    /* display each row grouping in group rows */
    const groupDisplayType = 'singleColumn';

    const [messages, setMessage] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [error, setError] = useState(userError);
    const [exerciseType, setExerciseType] = useState("all");

    const fetchMessage = useCallback(async (startDate = null, endDate = null) => {
        try{
            let query = exerciseType !== "all" ? `?userId=${userInfo._id}&exercise=${exerciseType}` : `?userId=${userInfo._id}`;
            if(startDate){
                if(query !== "") query = `${query}&startDate=${startDate}`;
                else query = `?startDate=${startDate}`;
            }
            
            if(endDate){
                if(query !== "") query = `${query}&endDate=${endDate}`;
                else query = `?endDate=${endDate}`;
            }
            setFetching(true);
            const response = await api('get', `${apiURL}/Message${query}`);
            setFetching(false);
            const data = response.data.map (item => ({datetime: item.datetime, exercise_routine: item.exercise_routine, duration: item.duration}))
            setMessage(data);
        }
        catch(err){
            setError(err.message || "Server error");
        }
       
    }, [setMessage, exerciseType])

    useEffect(()=>{
        if(!userInfo) navigate('/signin');
		else fetchMessage();
    }, [])

    const onDateChange = (date, dateString) => {
        setDateRange(dateString);
    }

    const handleQuery = () => {
        const startDate = dateRange.length && dateRange[0] !== "" ? `${dateRange[0]} 00:00:00` : null;
        const endDate = dateRange.length && dateRange[1] !== "" ? `${dateRange[1]} 23:59:59` : null;
        fetchMessage(startDate, endDate);
    }

    const handleExport = useCallback(() => {
        if(isRichFeature)
            gridRef.current.api.exportDataAsExcel({author: "Trung Huynh", sheetName:`${userInfo.username} Exercises`});
        else
            gridRef.current.api.exportDataAsCsv();

    }, []);

    return (
        <div>
            <div className = "row center">
                {(loading ||fetching) && <LoadingBox label="Loading  data..." />}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
            </div>
            <div className = "row center">
                <Card
                    title="Exercise records"
                    className='card'
                    actions={[
                        <Button type="primary" onClick={handleQuery}>Query</Button>,
                        <Button type="primary" onClick={handleExport}>Export</Button>
                    ]}
                >
                    <div className="row center">
                        <div>
                            <Select 
                                placeholder="Select a category"
                                defaultValue={exerciseType}
                                onChange={value => setExerciseType(value)}
                                style={{ width: 98 }}
                            >
                                <Select.Option value="all">All</Select.Option>
                                <Select.Option value="walking">Walking</Select.Option>
                                <Select.Option value="jogging">Jogging</Select.Option>                      
                                <Select.Option value="cycling">Cycling</Select.Option>
                                <Select.Option value="skipping">Skipping</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <RangePicker onChange ={onDateChange}/>
                        </div>
                    </div>
                    <div className="ag-theme-alpine-dark" style={{height: 430, width: "100%"}}> 
                        <AgGridReact
                            ref={gridRef}
                            modules={gridModules}
                            pagination={true}
                            columnDefs={columnDefs}
                            rowData={messages}
                            defaultColDef={{sortable: true, filter: true }}
                            
                            {...(isRichFeature && {suppressAggFuncInHeader: true})}
                            {...(isRichFeature && {groupDisplayType: groupDisplayType})}
                            {...(isRichFeature && {groupIncludeFooter: true})}
                            {...(isRichFeature && {groupIncludeTotalFooter: true})}

                            sideBar={{
                                toolPanels: [
                                  {
                                    id: "columns",
                                    labelDefault: "Columns",
                                    labelKey: "columns",
                                    iconKey: "columns",
                                    toolPanel: "agColumnsToolPanel"
                                  },
                                  {
                                    id: "filters",
                                    labelDefault: "Filters",
                                    labelKey: "filters",
                                    iconKey: "filter",
                                    toolPanel: "agFiltersToolPanel"
                                  }
                                ],
                                position: "left",
                                /*defaultToolPanel: "filters"*/
                            }}
                        >
                        </AgGridReact>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default ReportUI;