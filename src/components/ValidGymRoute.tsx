import { useParams, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGym } from "../hooks/useApi";

export default function ValidGymRoute() {
  const { gymName } = useParams<{ gymName: string }>();
  const navigate = useNavigate();
  const { data: gym, isLoading } = useGym(gymName);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-display">Gym Not Found</h1>
          <p className="text-muted-foreground">The gym "{gymName}" does not exist.</p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
