import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Card, Button, InputNumber, Row, Col, DatePicker, Select } from 'antd';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

import {connect as connectWebSocket, send} from '../actions/socketAction';

import useMQTT from '../hooks/useMQTT';

import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import Receiver from '../components/Receiver';

import api from '../utils/api';

const apiURL = "http://localhost:8282";
const socketURL = 'ws://localhost:8080';
const topic = "sit/community/excercise";

const HomeUI =  props => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isSub = useRef(false);

	const [fetching, setFetching] = useState(false);
	const [offlineMessage, setOfflineMessage] = useState([]);

	const { userInfo, loading, error: userError } = useSelector((state) => state.userSignIn);
	const { action } = useSelector(state => state.socket);
	
	const {status, message, error: mqttError, connect: connectMQTT, publish, subscribe, unSubscribe} = useMQTT({});
	const [error, setError] = useState(userError || mqttError);
	const [form] = Form.useForm();

	const fetchUser = useCallback(async userId => {
        try{
            setFetching(true);
            const response = await api('get', `${apiURL}/User/${userId}`);
            setFetching(false);
			return response.data;
        }
        catch(err){
            setError(err.message || "Server error");
        }
       
    }, [])

	const fetchOfflineMessage = useCallback(async lastTimeRead => {
        try{
            setFetching(true);
            const _messages = await api('get', `${apiURL}/Message/offline?lastTimeRead=${lastTimeRead}`);
            setFetching(false);
			return _messages;
        }
        catch(err){
            setError(err.message || "Server error");
        }
    }, [])

	const fetchData = useCallback(async userId => {
        try{
			const {last_time_read} = await fetchUser(userId);
			const response = await fetchOfflineMessage(last_time_read);
			setOfflineMessage(response.data);
        }
        catch(err){
            setError(err.message || "Server error");
        }
       
    }, [])

	const updateLastVistiedTime = (userId, latestTimeRead = "") => {
		dispatch(send(JSON.stringify({action: "UPDATE_LAST_VISITED_TIME", user_id: userId, last_time_read: latestTimeRead})))
	}

	/* TODO
		* need to disconntect from MQTT and websocket in `return () => ....`
		* setup MQTT and Websocket in App
	*/
	useEffect( () => {
		if(!userInfo){
			navigate('/signin');
		}
		else{
			/* connect to MQTT and Webscoket */
			connectMQTT();
			dispatch(connectWebSocket(socketURL));

			fetchData(userInfo._id);

			return () => {
				/* user navigate to other pages also consider as offline */
				updateLastVistiedTime(userInfo._id);
			}
		}
	}, [userInfo])

	/* MQTT subscribe handler */
	useEffect(()=>{
		if(status === "connected" && !isSub.current){
			isSub.current = true;
			subscribe({topic: topic});
		}
	}, [status, subscribe])

	/* MQTT message received handler */
	useEffect(()=>{
		if(message !== ""){
			const payload = JSON.parse(message.message);
			updateLastVistiedTime(userInfo._id, payload.created_datetime);
		}
	}, [message])

	/* Websocket handler */
	useEffect(() => {
		if(action === "SOCKET_CONNECT_SUCCESS" && userInfo && userInfo._id){
			dispatch(send(JSON.stringify({action: "LINK", user_id: userInfo._id})));
		}
			
	}, [action, userInfo])

	const handleDateTimeChange = (value, dateString) => {
	}

	const handleExerciseChange = value => {
		
	}
	const onDateTimeOk = value => {
	}

	const onFinish = async values => {
		values.user = {id: userInfo._id, username: userInfo.username};
		values.topic = topic;
		values.datetime = values.datetime.format("YYYY-MM-DD HH:mm:ss");
		const {topic: _topic, ...payload} = values;

		const req = {
			datetime: payload.datetime,
			exercise_routine: payload.exercise_routine,
			duration: payload.duration,
			topic: _topic,
			user_id: payload.user.id,
		};
		const response = await api('post', `${apiURL}/Message`, req);
		if(response.error) setError(response.message);
		else{
			payload.created_datetime = response.data.created_datetime;
			await publish({topic: _topic, payload: JSON.stringify(payload)}); 
		} 
	}

	const onReadOfflineMessage = () => {
		setOfflineMessage([]);
		updateLastVistiedTime(userInfo._id)
	}

	const handleSend = () => {
		form.submit();
	};

	const PublishForm = (
		<Form
			layout="vertical"
			name="basic"
			form={form}
			onFinish={onFinish}
		>
			<Row gutter={20}>
				<Col span={8}>
					<Form.Item
						label="Date & Time"
						name="datetime"
					>
						<DatePicker showTime onChange={handleDateTimeChange} onOk={onDateTimeOk} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label="Exercise routine"
						name="exercise_routine"
					>
						<Select onChange={handleExerciseChange}>
							<Select.Option value="walking">Walking</Select.Option>
							<Select.Option value="jogging">Jogging</Select.Option>                      
							<Select.Option value="cycling">Cycling</Select.Option>
							<Select.Option value="skipping">Skipping</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label="Duration"
						name="duration"
					>
						<InputNumber addonBefore={<ClockCircleOutlined />} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)

	return (
		<div className = "col" >
			<div className = "row center">
				{(loading || fetching || status === "connecting") && <LoadingBox label={loading || fetching ? "Loading user..." : status ? "Connecting to MQTT broker..." : "Loading"} />}
				{error && <MessageBox variant="danger">{error}</MessageBox>}
			</div>
			<div className = "row center">
				<Card
					title="Daily exercise"
					className='card'
					actions={[
						<Button type="primary" onClick={handleSend}>Send</Button>
					]}
			>
					{PublishForm}
				</Card>
			</div>
			<div className = "row center">
				<Receiver 
					payload={message}
					offlineMessage={offlineMessage}
					onReadOfflineMessage = {onReadOfflineMessage}
				/>
			</div>
		</div>
	);
};

export default HomeUI;