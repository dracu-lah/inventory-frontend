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

  const handleToggle = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
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
        {menuConfig.map((menu) => {
          const Icon = menu.icon;
          return (
            <div key={menu.label}>
              <ListItemButton
                onClick={() =>
                  menu.subMenu ? handleToggle(menu.label) : navigate(menu.route)
                }
                selected={isActiveRoute(menu.route)}
              >
                {Icon && (
                  <ListItemIcon>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText primary={menu.label} />
                {menu.subMenu &&
                  (openMenus.includes(menu.label) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>

              {menu.subMenu && (
                <Collapse
                  in={openMenus.includes(menu.label)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {menu.subMenu.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <ListItemButton
                          key={sub.label}
                          sx={{ pl: 4 }}
                          onClick={() => navigate(sub.route)}
                          selected={isActiveRoute(sub.route)}
                        >
                          {SubIcon && (
                            <ListItemIcon>
                              <SubIcon fontSize="small" />
                            </ListItemIcon>
                          )}
                          <ListItemText primary={sub.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
