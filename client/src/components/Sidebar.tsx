import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store.ts";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 10 minutes

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("You have been logged out due to inactivity.");
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Start the timer initially
    resetTimer();

    return () => {
      clearTimeout(timeout);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{ width: 250, flexShrink: 0, "& .MuiDrawer-paper": { width: 250 } }}
    >
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h6">
          Welcome, {user?.fullname || "Guest"}
        </Typography>
      </Box>
      <List>
        <ListItem
          component={NavLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&.active": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <ListItemText primary="Tasks" />
        </ListItem>
        {/* Logic for this is included in the sign in/out apis */}
        {/* 
        <ListItem
          component={NavLink}
          to="/attendance"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&.active": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <ListItemText primary="Attendance" />
        </ListItem> */}
        <ListItem
          component={NavLink}
          to="/change-password"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&.active": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <ListItemText primary="Change Password" />
        </ListItem>
        <ListItem
          component={NavLink}
          to="/missing-entry"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&.active": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <ListItemText primary="Missing Entry" />
        </ListItem>
        <ListItem
          component={NavLink}
          to="/leave-request"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&.active": {
              bgcolor: "primary.light",
              color: "primary.contrastText",
            },
          }}
        >
          <ListItemText primary="Leave Request" />
        </ListItem>
        {user?.role !== "employee" && user?.role !== "supervisor" && (
          <ListItem
            component={NavLink}
            to="/users"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Users" />
          </ListItem>
        )}

        {user?.role !== "employee" && user?.role !== "hr_personnel" && (
          <ListItem
            component={NavLink}
            to="/create-task"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Create Task" />
          </ListItem>
        )}

        {(user?.role === "manager" || user?.role === "system_admin") && (
          <ListItem
            component={NavLink}
            to="/review-change-password-requests"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Review Password Requests" />
          </ListItem>
        )}

        {(user?.role === "manager" || user?.role === "system_admin") && (
          <ListItem
            component={NavLink}
            to="/review-escalation-requests"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Review Escalation Requests" />
          </ListItem>
        )}

        {(user?.role === "manager" || user?.role === "system_admin") && (
          <ListItem
            component={NavLink}
            to="/review-incorrect-attendance-requests"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Review Incorrect Attendance Requests" />
          </ListItem>
        )}

{(user?.role === "manager" || user?.role === "system_admin") && (
          <ListItem
            component={NavLink}
            to="/review-leave-requests"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Review Leave Requests" />
          </ListItem>
        )}

        {user?.role === "system_admin" && (
          <ListItem
            component={NavLink}
            to="/create-user"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&.active": {
                bgcolor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemText primary="Create User" />
          </ListItem>
        )}
      </List>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
