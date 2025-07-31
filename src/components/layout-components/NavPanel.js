import React from 'react';
import { Menu } from 'antd';
import { connect } from "react-redux";
import { NavProfile } from './NavProfile';

const NavPanel = () => {



  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item>
        </Menu.Item>
        <Menu.Item >
          <NavProfile ></NavProfile>
        </Menu.Item>
      </Menu>
    </>
  );
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale }
};

export default connect(mapStateToProps)(NavPanel);