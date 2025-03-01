  import { useState } from "react";
  import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
  } from "@mui/material";
  import axios from "axios";
  import { useAuthStore } from "../store";

  const MissingEntry = () => {
    const backend = import.meta.env.VITE_BACKEND;
    const { user } = useAuthStore();
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!checkIn || !checkOut) {
        setError("All fields are required");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${backend}/incorrect-attendance`, {
          user_id: user?._id,
          from: checkIn,
          to: checkOut,
        });

        console.log("Missing entry recorded:", response.data);
        alert("Missing entry recorded successfully!");
      } catch (error) {
        console.error("Error taking missing entry:", error);
        setError("Failed to record missing entry.");
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
          Missing Entry for {today}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Check-in Time"
            type="time"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <TextField
            label="Check-out Time"
            type="time"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Entry"}
          </Button>
        </form>
      </Box>
    );
  };

  export default MissingEntry;
