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

const TakeAttendance = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backend}/sessions`, {
        user_id: user?._id,
        check_in: checkIn,
        check_out: checkOut,
      });

      console.log("Attendance recorded:", response.data);
      alert("Attendance recorded successfully!");
    } catch (error) {
      console.error("Error taking attendance:", error);
      setError("Failed to record attendance.");
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
        Take Attendance
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
          {loading ? <CircularProgress size={24} /> : "Submit Attendance"}
        </Button>
      </form>
    </Box>
  );
};

export default TakeAttendance;
