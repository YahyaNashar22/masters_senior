import { useEffect, useState } from "react";
import { useAuthStore } from "../store";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";

const ReviewChangePasswordRequests = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/change-password-requests`);
        setRequests(res.data);
        console.log(res);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [backend]);

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    try {
      await axios.put(`${backend}/change-password-requests/${id}/status`, {
        status,
        approved_by: user?._id,
      });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status, approved_by: user?._id } : req
        )
      );
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <main>
      <Typography variant="h4" gutterBottom>
        Review Change Password Requests
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    {req.approved_by ? req.approved_by : "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" && (
                      <>
                        <Button
                          color="success"
                          onClick={() => handleAction(req._id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleAction(req._id, "rejected")}
                          sx={{ ml: 1 }}
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
    </main>
  );
};

export default ReviewChangePasswordRequests;
