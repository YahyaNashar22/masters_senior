import { useEffect, useState } from "react";
import { useAuthStore } from "../store";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
} from "@mui/material";

const CreateTask = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useAuthStore();

  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    assignee: "",
  });

  const [employees, setEmployees] = useState<{ _id: string; email: string }[]>(
    []
  );
  const [role, setRole] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      await axios.post(`${backend}/tasks`, {
        ...task,
        created_by: user?._id, // Assign current user as creator
      });

      setSuccess(true);
      setTask({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        assignee: "",
      });
    } catch (error) {
      console.log(error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "supervisor") {
      setRole(["employee", "hr_personnel"]);
    } else if (user?.role === "manager") {
      setRole(["employee", "hr_personnel", "supervisor"]);
    } else if (user?.role === "system_admin") {
      setRole(["employee", "hr_personnel", "supervisor", "manager", "system_admin"]);
    }
     else {
      setRole([]);
    }
  }, [user]);

  useEffect(() => {
    if (role.length === 0) return;
    const handleFetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${backend}/users`,
          { role: role }, // Send an array of roles
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setEmployees(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchUsers();
  }, [backend, role, user]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
        />
        <TextField
          label="Due Date"
          name="due_date"
          type="date"
          value={task.due_date}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={task.priority}
            onChange={(e) =>
              setTask({ ...task, priority: e.target.value as string })
            }
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        {/* Select for Employees */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Assign to Employee</InputLabel>
          <Select
            name="assignee"
            value={task.assignee}
            onChange={(e) =>
              setTask({ ...task, assignee: e.target.value as string })
            }
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Task
            </Button>
          )}
          {success && (
            <Typography color="success.main" mt={2}>
              Task created successfully!
            </Typography>
          )}
          {error && (
            <Typography color="error.main" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default CreateTask;
