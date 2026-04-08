import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { CalendarCheck, CreditCard, Clock, Crown, Loader2 } from "lucide-react";
import MemberAttendanceHistory from "./MemberAttendanceHistory";
import MemberSubscription from "./MemberSubscription";
import { useUsers, useSubscriptions, useMembershipPlans, useMe } from "@/hooks/useApi";

export default function MemberDashboard() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const { data: authUser, isLoading: isAuthLoading } = useMe();
  const gymId = authUser?.gymId || 1;

  const users = useUsers({ gymId }).data?.users || [];
  const subscriptions = useSubscriptions().data?.subscriptions || [];
  const plans = useMembershipPlans(gymId).data?.memberships || [];

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const member = users.find(u => u.id === authUser?.id) || authUser;
  const sub = member ? subscriptions.find(s => s.userId === member.id && s.status === "Active") : null;
  const plan = sub ? plans.find(p => p.id === sub.planId) : null;
  
  // Local static mock for attendance
  const attendance = [
    { id: 1, date: new Date().toISOString().split("T")[0], timeIn: new Date().toISOString(), timeOut: new Date().toISOString(), source: "Biometric" }
  ];
  const recentAttendance = attendance.slice(-5).reverse();

  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;


  if (currentTab === "attendance") {
    return <MemberAttendanceHistory />;
  }

  if (currentTab === "subscription") {
    return <MemberSubscription />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-2">
          Welcome, {member?.name.split(" ")[0] || "Member"}
          {plan?.name.toLowerCase().includes("premium") && (
            <Crown className="h-6 w-6 text-yellow-500 fill-yellow-400" />
          )}
        </h1>
        <p className="text-muted-foreground">Your fitness dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-bold font-display">{plan?.name || "No Plan"}</p>
                {sub && (
                  <Badge variant="outline" className={sub.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {sub.status}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-2xl font-bold font-display">{daysLeft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold font-display">{attendance.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{a.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(a.timeIn).toLocaleTimeString()} – {a.timeOut ? new Date(a.timeOut).toLocaleTimeString() : "In progress"}
                  </p>
                </div>
                <Badge variant={a.source === "Biometric" ? "default" : "secondary"}>{a.source}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
