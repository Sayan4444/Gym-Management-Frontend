import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <ShieldAlert className="h-20 w-20 text-destructive mb-6" />
      <h1 className="text-4xl font-bold font-display tracking-tight text-foreground mb-4">
        Invalid Access
      </h1>
      <p className="text-muted-foreground text-lg text-center max-w-md mb-8">
        You do not have the necessary permissions to view this page. Please ensure you are logged in with the correct account.
      </p>
      <Button asChild size="lg">
        <Link to="/" className="gap-2">
          <Home className="h-5 w-5" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
