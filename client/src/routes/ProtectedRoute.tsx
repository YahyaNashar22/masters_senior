import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store.ts";

type ProtectedRouteProps = {
  allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    console.log("User is null. Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("User is not authorized. Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
