import { Box, CircularProgress, Typography } from "@mui/material";

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography
        variant="h6"
        sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default PageLoader;
