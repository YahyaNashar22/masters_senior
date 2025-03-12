import { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useAuthStore } from "../store";
import axios from "axios";

const ReviewLeaveRequests = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/leave-requests`);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [backend]);

  const handleAction = async (requestId: string, status: string) => {
    try {
      await axios.put(`${backend}/leave-requests/${requestId}/status`, {
        status,
        approved_by: user?._id,
      });
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status } : req))
      );
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Review Leave Requests
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Requested By</strong>
                </TableCell>
                <TableCell>
                  <strong>Reason</strong>
                </TableCell>
                <TableCell>
                  <strong>From</strong>
                </TableCell>
                <TableCell>
                  <strong>To</strong>
                </TableCell>
                <TableCell>
                  <strong>Full Day</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    {request.user_id
                      ? `${request.user_id.fullname} (${request.user_id.email})`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.from || "N/A"}</TableCell>
                  <TableCell>{request.to || "N/A"}</TableCell>
                  <TableCell>{request.full_day ? "Yes" : "No"}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAction(request._id, "accepted")}
                          style={{ marginRight: "5px" }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleAction(request._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ReviewLeaveRequests;
