import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    // Not authenticated — no user data stored
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      // Authenticated but improper role
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    // Invalid user data
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
