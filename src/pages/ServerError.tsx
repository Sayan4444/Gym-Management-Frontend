import { AlertTriangle, ServerCrash, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const ServerError = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleTryAgain = () => {
    window.location.href = redirectPath;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6 flex flex-col items-center">
        <div className="bg-destructive/10 p-4 rounded-full inline-flex items-center justify-center">
          <ServerCrash className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Connection Error</h1>
          <p className="text-muted-foreground">
            We are unable to connect to the backend server. The server might be down for maintenance or you might have a network issue.
          </p>
        </div>
        <Button 
          onClick={handleTryAgain}
          className="w-full sm:w-auto"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ServerError;
