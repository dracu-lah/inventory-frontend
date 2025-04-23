import { Box, CssBaseline, Toolbar } from "@mui/material";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { Suspense } from "react";
import { Outlet } from "react-router";
import PageLoader from "@/components/loaders/PageLoader";
// import ScrollToTop from './ScrollToTop';
import useAuthStore from "@/store/useAuthStore";

const drawerWidth = 240;

const RootLayout = () => {
  const { accessToken } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <Header />

      <Box sx={{ display: "flex", flex: 1 }}>
        {accessToken && <Sidebar />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 64px)",
            overflow: "auto",
            ml: accessToken ? `${drawerWidth}px` : 0,
            p: 2,
          }}
        >
          <Toolbar />
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>

      {/* <ScrollToTop /> */}
    </Box>
  );
};

export default RootLayout;
