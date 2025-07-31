import {
    DashboardOutlined,ProfileOutlined,AccountBookOutlined,LogoutOutlined, MailOutlined, BookOutlined, AuditOutlined,TransactionOutlined
  } from '@ant-design/icons';
  import { strings } from 'res';
  
  const dashBoardNavTree = [{
    key: "home",
    path: strings.navigation.page.dashboard,
    title: "Home",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [{
      key: "dashboard",
      path: strings.navigation.path.dashboard,
      title: "Dashboard",
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    },
    {
      key: strings.submenu.ar,
      path: strings.navigation.path.ar_dashboard,
      title: strings.submenu.ar,
      icon: BookOutlined,
      breadcrumb: false,
      submenu: [{
        key: strings.submenu2.ar_app,
        path: strings.navigation.path.ar_app,
        title: strings.submenu2.ar_app,
        breadcrumb: false,
        submenu: []
      },
      {
        key: strings.submenu2.ar_dashboard,
        path: strings.navigation.path.ar_dashboard,
        title: strings.submenu2.ar_dashboard,
        breadcrumb: false,
        submenu: []
      }]
    },
    {
      key: strings.submenu.sr,
      path: strings.navigation.path.sr_dashboard,
      title: strings.submenu.tmailc,
      icon: MailOutlined,
      breadcrumb: false,
      submenu: [
        {
          key: strings.submenu2.sr_dashbosrd,
          path: strings.navigation.path.sr_dashboard,
          title: strings.submenu2.sr_dashboard,
          breadcrumb: false,
          submenu: []
        }
        , {
          key: strings.submenu2.sr_app,
          path: strings.navigation.path.sr_app,
          title: strings.submenu2.sr_app,
          breadcrumb: false,
          submenu: []
        }]
    },
    {
      key: strings.submenu.md,
      path: strings.navigation.path.md_dashboard,
      title: strings.submenu.md_dashboard,
      icon: AuditOutlined,
      breadcrumb: false,
      submenu: [{
        key: strings.submenu2.md_dashboard,
        path: strings.navigation.path.md_dashboard,
        title: strings.submenu2.md_dashboard,
        breadcrumb: false,
        submenu: []
      }, {
        key: strings.submenu2.md_app,
        path: strings.navigation.path.md_app,
        title: strings.submenu2.md_app,
        breadcrumb: false,
        submenu: []
      }]
    }]
  }]
  
  const aboutNavTree = [{
    key: strings.menu.accounts,
    path: strings.navigation.path.accounts,
    title: strings.menu.accounts,
    icon: AccountBookOutlined,
    breadcrumb: false,
    submenu: [{
      key: strings.submenu.accounts,
      path: strings.navigation.path.accounts,
      title: strings.submenu.accounts,
      icon: AccountBookOutlined,
      breadcrumb: false,
      submenu: []
    },{
      key: strings.submenu.profile,
      path: strings.navigation.path.profile,
      title: strings.submenu.profile,
      icon: ProfileOutlined,
      breadcrumb: false,
      submenu: []
    },{
      key: strings.submenu.billing,
      path: strings.navigation.path.logout,
      title: strings.submenu.billing,
      icon: TransactionOutlined,
      breadcrumb: false,
      submenu: []
    },{
      key: strings.submenu.logout,
      path: strings.navigation.path.logout,
      title: strings.submenu.logout,
      icon: LogoutOutlined,
      breadcrumb: false,
      submenu: []
    }]
  }]
  
  const navigationConfig = [
    ...dashBoardNavTree,
    ...aboutNavTree
  ]
  
  export default navigationConfig;
  