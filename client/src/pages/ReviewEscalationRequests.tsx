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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuthStore } from "../store";
import axios from "axios";

const ReviewEscalationRequests = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/escalations`);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          `${backend}/users`,
          {
            role:
              user?.role === "manager"
                ? ["employee", "hr_personnel", "supervisor"]
                : ["employee", "hr_personnel", "supervisor", "manager"],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ); // Fetch available users
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchRequests();
    fetchUsers();
  }, [backend, user]);

  // ✅ Handle "Accept" Click → Open Dialog
  const handleAccept = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDialogOpen(true);
  };

  // ✅ Handle "Reject" Click → Directly Reject the Request
  const handleReject = async (requestId: string) => {
    try {
      await axios.put(`${backend}/escalations/${requestId}`, {
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

  // ✅ Handle Task Assignment
  const handleAssignTask = async () => {
    if (!selectedRequestId || !selectedUser) return;

    // Find the request to get the correct task_id
    const request = requests.find((req) => req._id === selectedRequestId);
    if (!request || !request.task_id?._id) {
      console.error("Task ID not found for this request");
      return;
    }

    const taskId = request.task_id._id; // Extract Task ID

    try {
      // ✅ Update escalation request status & approval
      await axios.put(`${backend}/escalations/${selectedRequestId}`, {
        status: "accepted",
        approved_by: user?._id, // Store approver ID
      });

      // ✅ Update the task to assign it to the selected user
      await axios.put(`${backend}/tasks/${taskId}`, {
        assignee: selectedUser,
      });

      // ✅ Update UI to reflect accepted status
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequestId ? { ...req, status: "accepted" } : req
        )
      );

      setDialogOpen(false);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Review Escalation Requests
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Task</strong>
                </TableCell>
                <TableCell>
                  <strong>Requested By</strong>
                </TableCell>
                <TableCell>
                  <strong>Approved By</strong>
                </TableCell>
                <TableCell>
                  <strong>Reason</strong>
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
                    {request.task_id
                      ? `${request.task_id.title} - ${request.task_id.description}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {request.requested_by
                      ? `${request.requested_by.fullname} (${request.requested_by.email})`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {request.approved_by
                      ? `${request.approved_by.fullname} (${request.approved_by.email})`
                      : "Pending"}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAccept(request._id)}
                          style={{ marginRight: "5px" }}
                        >
                          Accept
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

      {/* Dialog to Select User for Task Assignment */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          <Typography>Select a user to assign this task:</Typography>
          <Select
            fullWidth
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.fullname} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignTask}
          >
            Assign Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewEscalationRequests;
