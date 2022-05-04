import React, {useState} from 'react';
import { Outlet } from 'react-router-dom';

import { Layout } from "antd";
import TopicMenu from '../components/TopicMenu';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

const WithSidebar = () => {
    /* sidebar with menu */
	const items = [{link:"/", label: "Exercise"}, {link:"/report", label: "Report"}];
	const [selectedKey, setSelectedKey] = useState("0");
	const changeSelectedKey = (event) => {
		const key = event.key;
		setSelectedKey(key);
	};
	const Menu = (
		<TopicMenu
		  items={items}
		  selectedKey={selectedKey}
		  changeSelectedKey={changeSelectedKey}
		/>
	);
    return (
    <>
        <NavBar menu={Menu} style={{backgroundColor: "#282c34"}} />
        <Layout style={{backgroundColor: "#282c34"}}>
            <SideBar menu={Menu} />
            <Layout.Content>
                <Outlet />
            </Layout.Content>
        </Layout>
    </>
  );
};

export default WithSidebar;