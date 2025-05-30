import { Route, Routes } from "react-router-dom";
import Users from "../pages/Users.tsx";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";

import Layout from "./Layout.tsx";
import ChangePassword from "../pages/ChangePassword.tsx";
import MissingEntry from "../pages/MissingEntry.tsx";
// import TakeAttendance from "../pages/TakeAttendance.tsx";
import LeaveRequest from "../pages/LeaveRequest.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Suspense } from "react";
import Loading from "../components/Loading.tsx";
import ChangePasswordRequested from "../pages/ChangePasswordRequested.tsx";
import UserProfile from "../pages/UserProfile.tsx";
import CreateTask from "../pages/CreateTask.tsx";
import CreateUserForm from "../components/CreateUserForm.tsx";
import ReviewChangePasswordRequests from "../pages/ReviewChangePasswordRequests.tsx";
import ReviewEscalationRequests from "../pages/ReviewEscalationRequests.tsx";
import ReviewIncorrectAttendanceRequests from "../pages/ReviewIncorrectAttendanceRequests.tsx";
import ReviewLeaveRequests from "../pages/ReviewLeaveRequests.tsx";

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
            <Route path="/" element={<Tasks />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/missing-entry" element={<MissingEntry />} />
            // ? Logic for this is included in the sign in/out apis
            {/* <Route path="/attendance" element={<TakeAttendance />} /> */}
            <Route path="/leave-request" element={<LeaveRequest />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["manager", "system_admin", "hr_personnel"]}
              />
            }
          >
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserProfile />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["manager", "system_admin", "supervisor"]}
              />
            }
          >
            <Route path="/create-task" element={<CreateTask />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["manager", "system_admin"]} />
            }
          >
            <Route
              path="/review-change-password-requests"
              element={<ReviewChangePasswordRequests />}
            />
            <Route
              path="/review-escalation-requests"
              element={<ReviewEscalationRequests />}
            />
            <Route
              path="/review-incorrect-attendance-requests"
              element={<ReviewIncorrectAttendanceRequests />}
            />
            <Route
              path="/review-leave-requests"
              element={<ReviewLeaveRequests />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["system_admin"]} />}>
            <Route path="/create-user" element={<CreateUserForm />} />
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
