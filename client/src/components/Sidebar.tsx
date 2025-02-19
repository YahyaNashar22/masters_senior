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
import { NavLink } from "react-router-dom"; // Import NavLink for better routing

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log(user);

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
          to="/tasks"
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
        </ListItem>

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
