import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useMe } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { data: user, isLoading, isError } = useMe();
  const [searchParams] = useSearchParams();
    
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !user) {
    const token = searchParams.get("token");
    return <Navigate to={`/login${token ? `?token=${token}` : ""}`} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
