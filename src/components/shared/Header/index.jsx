import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" noWrap>
        My App
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
