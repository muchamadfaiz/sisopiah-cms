import React from "react";
import { connect } from "react-redux";
import { Menu, Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Logo from './Logo';
import NavPanel from './NavPanel';
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/features/theme';
import { NAV_TYPE_TOP, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_WIDTH } from 'constants/ThemeConstant';
import utils from 'utils'

const { Header } = Layout;

export const HeaderNav = props => {
  const { navCollapsed, mobileNav, navType, headerNavColor, toggleCollapsedNav, onMobileNavToggle, isMobile } = props;

  const onToggle = () => {
    if(!isMobile) {
      toggleCollapsedNav(!navCollapsed)
    } else {
      onMobileNavToggle(!mobileNav)
    }
  }

  const isNavTop = navType === NAV_TYPE_TOP ? true : false
  const mode = utils.getColorContrast(headerNavColor)
  const getNavWidth = () => {
    if(isNavTop || isMobile) {
      return '0px'
    }
    if(navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`
    } else {
      return `${SIDE_NAV_WIDTH}px`
    }
  }
  return (
    <Header className={`app-header ${mode}`}>
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Logo className={`p-2`} logoType={mode}/>
        <div className="nav" style={{width: `calc(100% - ${getNavWidth()})`}}>
          <div className="nav-left">
            <Menu mode="horizontal">
              {
                isNavTop && !isMobile ?
                null
                :
                <Menu.Item key="0" onClick={() => {onToggle()}}>
                  {navCollapsed || isMobile ? <MenuUnfoldOutlined className="nav-icon" style={{color:"#FFF"}} /> : <MenuFoldOutlined className="nav-icon" style={{color:"#FFF"}} />}
                </Menu.Item>
              }
               {/* {
                isMobile ?
                <Menu.Item key="1" onClick={() => {onSearchActive()}}>
                  <SearchOutlined />
                </Menu.Item>
                :
                <Menu.Item key="1" style={{cursor: 'auto'}}>
                  <SearchInput mode={mode} isMobile={isMobile} />
                </Menu.Item>
              } */}
            </Menu>
          </div>
          <div className="nav-right">
            <NavPanel />
          </div>
        </div>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, headerNavColor, mobileNav } =  theme;
  return { navCollapsed, navType, headerNavColor, mobileNav }
};

export default connect(mapStateToProps, {toggleCollapsedNav, onMobileNavToggle})(HeaderNav);