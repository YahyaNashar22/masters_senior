import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";

const UserProfile = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.post(
          `${backend}/users/get-user-info`,
          { userId: id },
          { headers: { "Content-Type": "application/json" } }
        );
        setSelectedUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [backend, id]);

  // Function to export all user data to Excel
  const exportToExcel = () => {
    if (!selectedUser) return;

    // User Info
    const userInfoSheet = [
      ["User ID", selectedUser.user.id],
      ["Full Name", selectedUser.user.fullname],
      ["Email", selectedUser.user.email],
      ["Role", selectedUser.user.role],
      [],
    ];

    // Sessions Data
    const sessionsSheet = [
      ["Sessions"],
      ["ID", "Check-In", "Check-Out", "Created At"],
      ...selectedUser.sessions.map((s: any) => [
        s._id,
        s.check_in,
        s.check_out || "N/A",
        new Date(s.createdAt).toLocaleString(),
      ]),
      [],
    ];

    // Leave Requests Data
    const leaveRequestsSheet = [
      ["Leave Requests"],
      ["ID", "Reason", "Status", "From", "To", "Full Day?"],
      ...selectedUser.leaveRequests.map((l: any) => [
        l._id,
        l.reason,
        l.status,
        l.from || "N/A",
        l.to || "N/A",
        l.full_day ? "Yes" : "No",
      ]),
      [],
    ];

    // Incorrect Attendance Requests
    const incorrectAttendanceSheet = [
      ["Incorrect Attendance Requests"],
      ["ID", "From", "To", "Status"],
      ...selectedUser.incorrectAttendanceRequests.map((i: any) => [
        i._id,
        i.from,
        i.to,
        i.status,
      ]),
      [],
    ];

    // Escalation Requests Data
    const escalationRequestsSheet = [
      ["Escalation Requests"],
      ["ID", "Reason", "Status"],
      ...selectedUser.escalationRequests.map((e: any) => [
        e._id,
        e.reason,
        e.status,
      ]),
      [],
    ];

    // Change Password Requests Data
    const changePasswordSheet = [
      ["Change Password Requests"],
      ["ID", "Email", "Status"],
      ...selectedUser.changePasswordRequests.map((c: any) => [
        c._id,
        c.email,
        c.status,
      ]),
    ];

    // Combine all sheets into one array
    const finalSheetData = [
      ...userInfoSheet,
      ...sessionsSheet,
      ...leaveRequestsSheet,
      ...incorrectAttendanceSheet,
      ...escalationRequestsSheet,
      ...changePasswordSheet,
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(finalSheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Data");

    // Write file
    XLSX.writeFile(wb, `user-${selectedUser.user.id}-data.xlsx`);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!selectedUser) {
    return (
      <Container>
        <Typography variant="h5">User data not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="h6">User Info</Typography>
      <Typography>Full Name: {selectedUser.user.fullname}</Typography>
      <Typography>Email: {selectedUser.user.email}</Typography>
      <Typography>Role: {selectedUser.user.role}</Typography>

      {/* Export Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={exportToExcel}
        sx={{ margin: "10px 0" }}
      >
        Export to Excel
      </Button>

      {/* Sessions Table */}
      <Typography variant="h6" gutterBottom>
        Sessions
      </Typography>
      <DataGrid
        rows={selectedUser.sessions.map((s: any) => ({
          id: s._id,
          check_in: s.check_in,
          check_out: s.check_out || "N/A",
          created_at: new Date(s.createdAt).toLocaleString(),
        }))}
        columns={[
          { field: "check_in", headerName: "Check-In", width: 200 },
          { field: "check_out", headerName: "Check-Out", width: 200 },
          { field: "created_at", headerName: "Created At", width: 250 },
        ]}
        autoHeight
      />

      {/* Leave Requests Table */}
      <Typography variant="h6" gutterBottom>
        Leave Requests
      </Typography>
      <DataGrid
        rows={selectedUser.leaveRequests.map((l: any) => ({
          id: l._id,
          reason: l.reason,
          status: l.status,
          from: l.from,
          to: l.to,
          full_day: l.full_day ? "Yes" : "No",
        }))}
        columns={[
          { field: "reason", headerName: "Reason", width: 250 },
          { field: "status", headerName: "Status", width: 150 },
          { field: "from", headerName: "From", width: 200 },
          { field: "to", headerName: "To", width: 200 },
          { field: "full_day", headerName: "Full Day?", width: 150 },
        ]}
        autoHeight
      />

      {/* Incorrect Attendance Requests Table */}
      <Typography variant="h6" gutterBottom>
        Incorrect Attendance Requests
      </Typography>
      <DataGrid
        rows={selectedUser.incorrectAttendanceRequests.map((i: any) => ({
          id: i._id,
          from: i.from,
          to: i.to,
          status: i.status,
        }))}
        columns={[
          { field: "from", headerName: "From", width: 200 },
          { field: "to", headerName: "To", width: 200 },
          { field: "status", headerName: "Status", width: 150 },
        ]}
        autoHeight
      />

      {/* Escalation Requests Table */}
      <Typography variant="h6" gutterBottom>
        Escalation Requests
      </Typography>
      <DataGrid
        rows={selectedUser.escalationRequests.map((e: any) => ({
          id: e._id,
          reason: e.reason,
          status: e.status,
        }))}
        columns={[
          { field: "reason", headerName: "Reason", width: 250 },
          { field: "status", headerName: "Status", width: 150 },
        ]}
        autoHeight
      />

      {/* Change Password Requests Table */}
      <Typography variant="h6" gutterBottom>
        Change Password Requests
      </Typography>
      <DataGrid
        rows={selectedUser.changePasswordRequests.map((c: any) => ({
          id: c._id,
          email: c.email,
          status: c.status,
        }))}
        columns={[
          { field: "email", headerName: "Email", width: 250 },
          { field: "status", headerName: "Status", width: 150 },
        ]}
        autoHeight
      />
    </Container>
  );
};

export default UserProfile;
