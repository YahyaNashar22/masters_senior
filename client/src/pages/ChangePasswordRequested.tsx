import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePasswordRequested = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { search } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract the email from the URL query parameters
    const params = new URLSearchParams(search);
    const emailFromUrl = params.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl); // Set the email to state
    } else {
      navigate("/login"); // Redirect if no email is found in the URL
    }
  }, [search, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate that email and new password are provided
    if (!email || !newPassword) {
      setError("Email and new password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend}/users/change-password-requested`,
        {
          email,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Password changed:", response.data);
      alert("Password changed successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          aria-readonly
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Change Password"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          {loading ? <CircularProgress size={24} /> : "Back"}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePasswordRequested;
