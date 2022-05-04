import React from "react";
import { NavLink } from 'react-router-dom'
import {Menu} from "antd";

import "./TopicMenu.css"

const TopicMenu = ({ items, selectedKey, changeSelectedKey }) => {
  const styledTopics = [];
  items.forEach((item, index) =>
    styledTopics.push(
      <Menu.Item key={index} onClick={changeSelectedKey} /*style = {{backgroundColor: "#000000", color: "white"}}*/>
         <NavLink to={item.link} /*style={{color: "white"}} activeStyle={{color: "#1890ff"}}*/>
           {item.label}
        </NavLink>
      </Menu.Item>
    )
  );
  
  return (
    <Menu mode="inline" theme='dark' selectedKeys={[selectedKey]} /*style = {{backgroundColor: "#000000", color: "white"}}*/>
      {styledTopics}
    </Menu>
  );
}

export default TopicMenu;