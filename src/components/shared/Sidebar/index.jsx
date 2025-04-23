import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { menuConfig } from "./menuConfig";

const drawerWidth = 240;

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = (key) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const isActiveRoute = (route) => route && location.pathname.startsWith(route);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuConfig.map((menu) => (
          <div key={menu.key}>
            <ListItemButton
              onClick={() =>
                menu.subMenu
                  ? handleToggle(menu.key)
                  : navigate(menu.route || "")
              }
              selected={isActiveRoute(menu.route)}
            >
              {menu.icon && (
                <ListItemIcon>{<menu.icon size={20} />}</ListItemIcon>
              )}
              <ListItemText primary={menu.label} />
              {menu.subMenu &&
                (openMenus.includes(menu.key) ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                ))}
            </ListItemButton>

            {menu.subMenu && (
              <Collapse
                in={openMenus.includes(menu.key)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {menu.subMenu.map((sub) => (
                    <ListItemButton
                      key={sub.key}
                      sx={{ pl: 4 }}
                      onClick={() => navigate(sub.route || "")}
                      selected={isActiveRoute(sub.route)}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
