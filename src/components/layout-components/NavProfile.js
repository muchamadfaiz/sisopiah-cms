import React from "react";
import { Menu, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';

const menuItem = []

export const NavProfile = () => {
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </a>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.legth + 1} onClick={e => {
            localStorage.clear()
            window.location.href = "/auth"
          }}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <UserOutlined style={{ color: "#FFF" }}></UserOutlined>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

export default NavProfile
