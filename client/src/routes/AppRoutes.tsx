import { Route, Routes } from "react-router-dom";
import Users from "../pages/Users.tsx";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";

import Layout from "./Layout.tsx";
import ChangePassword from "../pages/ChangePassword.tsx";
import MissingEntry from "../pages/MissingEntry.tsx";
import TakeAttendance from "../pages/TakeAttendance.tsx";
import LeaveRequest from "../pages/LeaveRequest.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Suspense } from "react";
import Loading from "../components/Loading.tsx";
import ChangePasswordRequested from "../pages/ChangePasswordRequested.tsx";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Role-Based Protected Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "employee",
                  "manager",
                  "system_admin",
                  "supervisor",
                  "hr_personnel",
                ]}
              />
            }
          >
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/missing-entry" element={<MissingEntry />} />
            <Route path="/attendance" element={<TakeAttendance />} />
            <Route path="/leave-request" element={<LeaveRequest />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["manager", "system_admin"]} />
            }
          >
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/change-password-requested"
          element={<ChangePasswordRequested />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
