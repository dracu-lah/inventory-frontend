import { Box, CssBaseline } from "@mui/material";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { Suspense, useRef } from "react";
import { Outlet } from "react-router";
import PageLoader from "@/components/loaders/PageLoader";
import useAuthStore from "@/store/useAuthStore";
import ScrollToTop from "./ScrollToTop";

const drawerWidth = 240;

const RootLayout = () => {
  const { accessToken } = useAuthStore();
  const isAuthenticated = Boolean(accessToken);
  const mainRef = useRef(null);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Header />
      {isAuthenticated && <Sidebar drawerWidth={drawerWidth} />}
      <Box
        ref={mainRef}
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: 3,
          pb: 3,
          width: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : "100%",
          height: "100vh",
          overflow: "auto",
          bgcolor: "background.default",
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
        <ScrollToTop targetRef={mainRef} />
      </Box>
    </Box>
  );
};

export default RootLayout;
