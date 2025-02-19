import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";

import Layout from "./Layout.tsx";
import ChangePassword from "../pages/ChangePassword.tsx";
import MissingEntry from "../pages/MissingEntry.tsx";
import TakeAttendance from "../pages/TakeAttendance.tsx";
import LeaveRequest from "../pages/LeaveRequest.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/missing-entry" element={<MissingEntry />} />
        <Route path="/attendance" element={<TakeAttendance />} />
        <Route path="/leave-request" element={<LeaveRequest />} />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
