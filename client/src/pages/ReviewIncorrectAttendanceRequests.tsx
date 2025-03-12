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
import axios from "axios";
import { useAuthStore } from "../store";

const ReviewIncorrectAttendanceRequests = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/incorrect-attendance`);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching attendance requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [backend]);

  const handleApprove = async (requestId: string) => {
    try {
      await axios.put(`${backend}/incorrect-attendance/${requestId}/status`, {
        status: "accepted",
        approved_by: user?._id,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axios.put(`${backend}/incorrect-attendance/${requestId}/status`, {
        status: "rejected",
        approved_by: user?._id,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "rejected" } : req
        )
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Review Incorrect Attendance Requests
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>From</strong>
                </TableCell>
                <TableCell>
                  <strong>To</strong>
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
                  <TableCell>{request.from}</TableCell>
                  <TableCell>{request.to}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleApprove(request._id)}
                          style={{ marginRight: "5px" }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleReject(request._id)}
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

export default ReviewIncorrectAttendanceRequests;