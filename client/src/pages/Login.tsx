import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store.ts"; // Import Zustand store
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { login } = useAuthStore();
  // Get the email value from the form

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const email = watch("email");

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backend}/users/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Login Response:", res.data);
      login(res.data); // Store user in Zustand

      // store user in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const requestPassChange = async (email: string) => {
    setLoading(true);

    try {
      if (email == "" || !email) {
        alert("Please provide your email");
        throw new Error("Please provide your email");
      }
      const res = await axios.post(
        `${backend}/change-password-requests`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 203) {
        alert(res.data.message);
        navigate(`/change-password-requested?email=${email}`);
      } else if (res.status === 404) {
        alert(res.data.message);
      } else if (res.status === 201) {
        alert("Password change request sent successfully");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError)
        alert(
          error?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        <Button
          type="submit"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => requestPassChange(email)}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          Request Password Change
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
