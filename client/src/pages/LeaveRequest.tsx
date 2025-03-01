import {
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../store";
import { useState } from "react";
import axios from "axios";

const LeaveRequest = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore(); // Assuming you're getting the logged-in user
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState<string>(""); // Using string for date value
  const [toDate, setToDate] = useState<string>(""); // Using string for date value
  const [fromTime, setFromTime] = useState<string>(""); // Time input for "From"
  const [toTime, setToTime] = useState<string>(""); // Time input for "To"
  const [fullDay, setFullDay] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Validate that all fields are filled
    if (!reason || !fromDate || !toDate) {
      setError("All fields are required");
      return;
    }

    // If not full day, check time fields
    if (!fullDay && (!fromTime || !toTime)) {
      setError("Please select start and end times.");
      return;
    }

    setLoading(true); // Start loading state

    try {
      const response = await axios.post(`${backend}/leave-requests`, {
        user_id: user?._id,
        reason,
        from: `${fromDate}T${fromTime}`,
        to: `${toDate}T${toTime}`,
        full_day: fullDay,
      });

      console.log("Leave request submitted:", response.data);
      alert("Leave request submitted successfully!");
    } catch (error) {
      console.error("Error submitting leave request:", error);
      setError("Failed to submit leave request.");
    }

    setLoading(false); // Stop loading state
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Leave Request Form
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Reason */}
        <TextField
          label="Reason for Leave"
          variant="outlined"
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* From Date */}
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* From Time */}
        {!fullDay && (
          <TextField
            label="From Time"
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}

        {/* To Date */}
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* To Time */}
        {!fullDay && (
          <TextField
            label="To Time"
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}

        {/* Full Day */}
        <FormControlLabel
          control={
            <Checkbox
              checked={fullDay}
              onChange={(e) => setFullDay(e.target.checked)}
              name="fullDay"
            />
          }
          label="Full Day Leave"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          Submit Leave Request
        </Button>
      </form>

      {/* Error Message */}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LeaveRequest;
