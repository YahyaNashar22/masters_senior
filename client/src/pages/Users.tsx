import { Suspense, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import axios from "axios";
import { useAuthStore } from "../store";
import * as XLSX from "xlsx"; // Import xlsx
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Users = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState<string[]>([]);

  useEffect(() => {
    if (user?.role === "hr_personnel") {
      setRole(["employee"]);
    } else if (user?.role === "manager") {
      setRole(["employee", "hr_personnel", "supervisor"]);
    } else {
      setRole([]); // Set a default role for other users if needed
    }
  }, [user]);

  useEffect(() => {
    if (role.length === 0) return; // Only fetch if role is set
    const handleFetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${backend}/users`,
          { role },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(res.data);
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchUsers();
  }, [backend, role, user]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullname", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="contained"
          color={params.row.status === "active" ? "success" : "error"}
          onClick={(e) =>
            handleStatusChange(e, params.row.id, params.row.status)
          }
        >
          {params.row.status === "active" ? "Active" : "Blocked"}
        </Button>
      ),
    },
  ];

  // Prepare data for the DataGrid
  const rows = users.map((u) => ({
    id: u._id,
    fullname: u.fullname,
    email: u.email,
    role: u.role,
    status: u.status,
  }));

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };

  // Handle row click to navigate to user profile
  const handleRowClick = (params: any) => {
    const userId = params.row.id;
    navigate(`/users/${userId}`);
  };

  const handleStatusChange = async (
    e: React.MouseEvent,
    userId: string,
    currentStatus: string
  ) => {
    e.stopPropagation(); // Prevent row click from triggering

    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await axios.put(
        `${backend}/users/${userId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, status: newStatus } : u
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            autoHeight
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            slots={{
              toolbar: () => (
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={exportToExcel}
                  >
                    Export to Excel
                  </Button>
                </div>
              ),
            }}
          />
        )}
      </Container>
    </Suspense>
  );
};

export default Users;
