import React from 'react'
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH, NAV_TYPE_TOP } from 'constants/ThemeConstant';
import { APP_NAME } from 'configs/AppConfig';
import { connect, useSelector } from "react-redux";
import utils from 'utils';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const getLogoWidthGutter = (props, isMobile) => {
  const { navCollapsed, navType } = props;
  const isNavTop = navType === NAV_TYPE_TOP ? true : false
  if(isMobile && !props.mobileLogo) {
    return 0
  }
  if(isNavTop) {
    return 'auto'
  }
  if(navCollapsed) {
    return `${SIDE_NAV_COLLAPSED_WIDTH}px`
  } else {
    return `${SIDE_NAV_WIDTH}px`
  }
}

const getLogo = (props) => {
  const { navCollapsed, sidebarLogo, collapsedSidebarLogo } = props;
  if (navCollapsed) return collapsedSidebarLogo
  return sidebarLogo
}

// const getLogoDisplay = (isMobile, mobileLogo) => {
//   if(isMobile && !mobileLogo) {
//     return 'd-none'
//   } else {
//     return 'logo'
//   }
// }

export const Logo = (props) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
  const width = `${getLogoWidthGutter(props, isMobile)}`;
  const { sidebarLogo, collapsedSidebarLogo } = useSelector(state => state.theme)
  return (
    <div style={{ width }}>
      <img src={getLogo({ ...props, sidebarLogo, collapsedSidebarLogo })} alt={`${APP_NAME} logo`} style={{ width, height: '100%', objectFit: 'contain', objectPosition: 'center', padding:"5px" }} />
    </div>
  )
}

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType } =  theme;
  return { navCollapsed, navType }
};

export default connect(mapStateToProps)(Logo);
