import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import routePath from "@/router/routePath";

export const menuConfig = [
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    route: routePath.dashboard,
  },
  {
    icon: <GroupIcon />,
    label: "Users",
    subMenu: [
      {
        label: "Manage Roles",
        route: routePath.roleManagement,
        icon: <AdminPanelSettingsIcon />,
      },
      {
        label: "User List",
        route: routePath.userList,
        icon: <ListAltIcon />,
      },
    ],
  },
];
