import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import useAuthStore from "@/store/useAuthStore";
import UserAuthMenu from "./UserAuthMenu";

const Header = () => {
  const { accessToken } = useAuthStore();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, borderRadius: 0 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
          Inventory Management
        </Typography>

        {accessToken && <UserAuthMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
