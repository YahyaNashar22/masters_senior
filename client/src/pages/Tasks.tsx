import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Container,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import EscalatorIcon from "@mui/icons-material/Escalator";

const Tasks = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<
    {
      _id: string;
      title: string;
      description: string;
      due_date: string;
      priority: "normal" | "high" | "low";
      status: "ongoing" | "completed" | "canceled" | "not_started";
      assignee?: { _id: string; fullname: string } | null; // Assignee
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [escalationReason, setEscalationReason] = useState<string>("");

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      let res;
      try {
        if (user?.role === "manager" || user?.role === "system_admin") {
          res = await axios.get(`${backend}/tasks`);
        } else {
          res = await axios.get(`${backend}/tasks/user/${user?._id}`);
        }
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) getTasks();
  }, [backend, user]);

  // Function to update task status
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setUpdatingTask(taskId); // Show loading for the updating task

    try {
      await axios.put(`${backend}/tasks/${taskId}/status`, {
        status: newStatus,
      });

      // Update local state after successful backend update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: newStatus as
                  | "ongoing"
                  | "completed"
                  | "canceled"
                  | "not_started",
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setUpdatingTask(null); // Remove loading state
    }
  };

  // Open the dialog for escalating the task
  const handleEscalateClick = (taskId: string) => {
    setSelectedTask(taskId);
    setOpenDialog(true);
  };

  // Handle escalating task
  const handleEscalateTask = async () => {
    if (selectedTask) {
      try {
        await axios.post(
          `${backend}/escalations`,
          {
            task_id: selectedTask,
            requested_by: user?._id,
            reason: escalationReason,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Close dialog after escalating
        setOpenDialog(false);
        alert("Task escalated successfully.");
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          // Handle 401 error (Escalation request already created)
          alert(error.response.data.message);
        } else {
          console.error("Error escalating task:", error);
        }
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Tasks
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks assigned yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Due: {task.due_date || "No deadline"}
                  </Typography>

                  {/* Assignee */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Assignee:</strong>{" "}
                    {task.assignee ? task.assignee.fullname : "Unassigned"}
                  </Typography>

                  {/* Priority Chip */}
                  <Chip
                    label={task.priority.toUpperCase()}
                    color={
                      task.priority === "high"
                        ? "error"
                        : task.priority === "low"
                        ? "success"
                        : "warning"
                    }
                    sx={{ mt: 1, mr: 1 }}
                  />

                  {/* Editable Status */}
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <Select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      disabled={updatingTask === task._id} // Disable while updating
                      sx={{
                        borderRadius: 2, // Make corners rounder
                        color: "white",
                        backgroundColor:
                          task.status === "ongoing"
                            ? "orange"
                            : task.status === "completed"
                            ? "green"
                            : task.status === "canceled"
                            ? "red"
                            : "grey",
                        "&:focus": {
                          backgroundColor:
                            task.status === "ongoing"
                              ? "orange"
                              : task.status === "completed"
                              ? "green"
                              : task.status === "canceled"
                              ? "red"
                              : "gray",
                        },
                        "& .MuiSelect-icon": {
                          color: "white", // White icon for the dropdown
                        },
                      }}
                    >
                      <MenuItem value="not_started">Not Started</MenuItem>
                      <MenuItem value="ongoing">Ongoing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="canceled">Canceled</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Escalate Task Icon Button */}
                  <IconButton
                    color="primary"
                    onClick={() => handleEscalateClick(task._id)}
                    disabled={updatingTask === task._id} // Disable while updating
                    sx={{ mt: 1 }}
                  >
                    <EscalatorIcon />
                  </IconButton>

                  {/* Loading indicator for status update */}
                  {updatingTask === task._id && (
                    <CircularProgress size={20} sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog (Pop-Up) for Escalation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Escalate Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for Escalation"
            fullWidth
            multiline
            rows={4}
            value={escalationReason}
            onChange={(e) => setEscalationReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEscalateTask} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;
