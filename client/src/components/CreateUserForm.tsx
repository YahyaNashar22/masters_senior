import { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface UserFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: "employee" | "hr_personnel" | "supervisor" | "manager" | "system_admin";
  status: "idle" | "blocked" | "active" | "logged_out";
}

const roles: UserFormData["role"][] = [
  "employee",
  "hr_personnel",
  "supervisor",
  "manager",
  "system_admin",
];
const statuses: UserFormData["status"][] = [
  "idle",
  "blocked",
  "active",
  "logged_out",
];

const CreateUserForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 2, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Create User
      </Typography>

      <Controller
        name="fullname"
        control={control}
        defaultValue=""
        rules={{ required: "Full Name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Full Name"
            fullWidth
            margin="normal"
            error={!!errors.fullname}
            helperText={errors.fullname?.message}
          />
        )}
      />

      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{ required: "Username is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
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
        defaultValue=""
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
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

      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Controller
          name="role"
          control={control}
          defaultValue="employee"
          render={({ field }) => (
            <Select {...field} label="Role">
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          defaultValue="logged_out"
          render={({ field }) => (
            <Select {...field} label="Status">
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create User"}
      </Button>
    </Box>
  );
};

export default CreateUserForm;
