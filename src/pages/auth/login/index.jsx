import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginAPI } from "@/services/api";
import routePath from "@/router/routePath";
import useAuthStore from "@/store/useAuthStore";
import { useToast } from "@/context/ToastContext";

const LoginPage = () => {
  const { showToast } = useToast();
  const { setToken } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    usernameOrEmail: "admin",
    password: "admin123",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues,
  });

  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: ({ data }) => {
      setToken({
        accessToken: data.token,
        refreshToken: data.refreshToken,
        data: {
          userName: data.userName,
          roles: data.roles,
        },
      });
      navigate(routePath.dashboard);
    },
    onError: (response) => {
      showToast(response.message, "danger");
      setError("root.serverError", {
        type: response.status,
        message: response.data.message,
      });
    },
  });

  const onSubmit = ({ usernameOrEmail, password }) => {
    queryClient.invalidateQueries();
    loginMutation.mutate({
      username: usernameOrEmail,
      password,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card sx={{ width: 350, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" component="div">
              Login
            </Typography>
          }
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                fullWidth
                id="email"
                label="Username / Email"
                variant="outlined"
                error={!!errors.usernameOrEmail}
                helperText={errors.usernameOrEmail?.message}
                {...register("usernameOrEmail", { required: true })}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password", { required: true })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {errors.root && (
                <Typography color="error" variant="body2">
                  {errors.root.serverError.message}
                </Typography>
              )}
            </Box>
          </CardContent>

          <CardActions sx={{ padding: 2, paddingTop: 0 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loginMutation.isPending}
              startIcon={
                loginMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export default LoginPage;
