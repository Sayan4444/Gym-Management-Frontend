import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGymIDFromDomain, useGym } from "../hooks/useApi";

export default function ValidGymRoute({ domain }: { domain: string }) {
  const { data: gymIdObj, isLoading: isIdLoading } = useGymIDFromDomain(domain);
  const { data: gym, isLoading: isGymLoading } = useGym(gymIdObj?.id,"membership_plans,addons");
  const navigate = useNavigate();

  const isLoading = isIdLoading || isGymLoading;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-display">Gym Not Found</h1>
          <p className="text-muted-foreground">The gym "{gym?.name}" does not exist.</p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
