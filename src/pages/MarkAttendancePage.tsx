import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useScanQRAttendance } from "@/hooks/apis/useAttendance";
import { Button } from "@/components/ui/button";
import { useMe } from "../hooks/useApi";


export default function MarkAttendancePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const markAttendanceMutation = useScanQRAttendance();
  const { data: me } = useMe()


  useEffect(() => {
    if (!token) return;

    console.log(token);
    markAttendanceMutation.mutate({ scannedToken: token }, {
      onSuccess: () => {
        toast.success("Attendance recorded successfully!");
      },
      onError: (error) => {
        const err = error as { response?: { status: number; data?: { error: string } }; message?: string };
        console.log(err.message);
        
        const status = err?.response?.status;
        if (status === 401) {
          navigate("/login");
        } else {
          toast.error(err?.response?.data?.error || "Failed to record attendance.");
        }
      }
    });
  }, [token, me, navigate, markAttendanceMutation.mutate]);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-2" />
            <CardTitle className="text-xl">Invalid Request</CardTitle>
            <CardDescription>No attendance token found.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="outline">Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-8">
          {markAttendanceMutation.isPending ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Marking attendance...</p>
            </div>
          ) : markAttendanceMutation.isSuccess ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <p className="text-lg font-semibold text-success">Done!</p>
              {/* <Button onClick={() => navigate(`/${me?.gym?.name || ""}`)} className="mt-4" variant="outline">
                Go to Dashboard
              </Button> */}
            </div>
          ) : markAttendanceMutation.isError ? (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-destructive font-medium">
                {((markAttendanceMutation.error as { response?: { data?: { error: string } } })?.response?.data?.error) || "Error marking attendance"}
              </p>
              {/* <Button onClick={() => navigate(`/${me?.gym?.name || ""}`)} className="mt-4" variant="outline">
                Back to Gym
              </Button> */}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Checking...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}