import { strings } from "res";
import { DashboardIcon, OrderIcon, ReportIcon, DeliveryIcon } from "../assets/svg/icon";
import {
  UserOutlined,
  DatabaseOutlined,
  CopyOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  AimOutlined,
  FileOutlined,
  BuildOutlined,
  DownCircleOutlined,
} from "@ant-design/icons";

import {
  all_privileges,
  admin_privileges,
  all_projects,
  opd_privileges,
  my_projects_privileges,
  verifikator,
  finished_projects,
  sertifikator,
} from "res/privileges/index";

const dashBoardNavTree = [
  {
    key: "Home",
    path: strings.navigation.path.dashboard,
    title: "Home",
    breadcrumb: false,
    submenu: [
      {
        key: "Dashboard",
        path: strings.navigation.path.dashboard,
        title: "Dashboard",
        icon: DashboardIcon,
        breadcrumb: false,
        access: all_privileges,
        submenu: [],
      },
      {
        key: "Murid",
        path: strings.navigation.path.student,
        title: "Murid",
        icon: BuildOutlined,
        breadcrumb: false,
        access: admin_privileges,
        submenu: [],
      },
      {
        key: "Wali Murid",
        path: strings.navigation.path.guardian,
        title: "Wali Murid",
        icon: FileOutlined,
        breadcrumb: false,
        access: admin_privileges,
        submenu: [],
      },
      {
        key: "Tagihan",
        path: strings.navigation.path.bill,
        title: "Tagihan",
        icon: CheckCircleOutlined,
        breadcrumb: false,
        access: admin_privileges,
        submenu: [],
      },
      {
        key: "Gaji",
        path: strings.navigation.path.wage,
        title: "Gaji",
        icon: AimOutlined,
        breadcrumb: false,
        access: admin_privileges,
        submenu: [],
      },
      // {
      //   key: "Verifikasi Dapur",
      //   path: strings.navigation.path.verification_projects,
      //   title: "Verifikasi Dapur",
      //   icon: DatabaseOutlined,
      //   breadcrumb: false,
      //   access: admin_privileges,
      //   submenu: []
      // },
      // {
      //   key: "Semua Dapur",
      //   path: strings.navigation.path.projects,
      //   title: "Semua Dapur",
      //   icon: AimOutlined,
      //   breadcrumb: false,
      //   access: admin_privileges,
      //   submenu: []
      // },
      // {
      //   key: "Instansi",
      //   path: strings.navigation.path.wajib_pajak,
      //   title: "Instansi",
      //   icon: OrderIcon,
      //   breadcrumb: false,
      //   access: admin_privileges,
      //   submenu: []
      // },
      {
        key: "Pengguna",
        path: strings.navigation.path.users,
        title: "Pengguna",
        icon: UserOutlined,
        access: admin_privileges,
        //   breadcrumb: false,
        submenu: [],
      },
    ],
  },
];

const ControlTree = [
  {
    key: "Pengaturan",
    path: strings.navigation.path.settings,
    title: "Pengaturan",
    breadcrumb: false,
    submenu: [
      {
        key: "Pengaturan",
        path: strings.navigation.path.settings,
        title: "Pengaturan",
        icon: SettingOutlined,
        breadcrumb: false,
        access: all_privileges,
        submenu: [],
      },
    ],
  },
];

const navigationConfig = [...dashBoardNavTree, ...ControlTree];

export default navigationConfig;
