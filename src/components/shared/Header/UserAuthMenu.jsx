import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import { AccountCircle, Logout, Person } from "@mui/icons-material";
import useAuthStore from "@/store/useAuthStore";

const UserAuthMenu = () => {
  const { clearToken, data } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    clearToken();
    handleMenuClose();
  };

  // Get first letter of username for avatar (if available)
  const avatarText = data?.userName
    ? data.userName.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleMenuOpen}
        size="medium"
        edge="end"
        aria-label="account menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
          {avatarText}
        </Avatar>
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {data?.userName && (
          <MenuItem disabled sx={{ opacity: 0.7 }}>
            <ListItemText
              primary={data.userName}
              secondary={data.roleName}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        )}

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAuthMenu;
