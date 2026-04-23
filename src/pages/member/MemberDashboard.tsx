import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, CreditCard, Clock, Crown, Loader2 } from "lucide-react";
import { useMe, useAttendance } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";
import { PaginationFooter } from "@/components/PaginationFooter";

const ITEMS_PER_PAGE = 5;

export default function MemberDashboard() {
  const { data: me, isLoading: isAuthLoading } = useMe("subscription");
  const { data: attendanceData } = useAttendance();

  const [page, setPage] = useState(1);

  const subs = me?.subscription;
  // Loop over it and find the one which has status = "Active"
  const activeSub = subs?.find((s) => s.status === "Active");
  const plan = activeSub?.plan;


  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const attendance = attendanceData?.attendance || [];
  const totalPages = Math.ceil(attendance.length / ITEMS_PER_PAGE);
  const pagedAttendance = attendance.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const daysLeft = activeSub ? Math.max(0, Math.ceil((new Date(activeSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-2">
          Welcome, {me?.name.split(" ")[0] || "Member"}
          {activeSub?.plan?.name.toLowerCase().includes("premium") && (
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
                {activeSub && (
                  <Badge variant="outline" className={activeSub.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                    {activeSub.status}
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
            {pagedAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{formatDate(a.date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(a.timeIn)} – {a.timeOut ? formatTime(a.timeOut) : "In progress"}
                  </p>
                </div>
                <Badge variant={a.source === "Biometric" ? "default" : "secondary"}>{a.source}</Badge>
              </div>
            ))}
          </div>
          <PaginationFooter
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={attendance.length}
            itemName="check-ins"
          />
        </CardContent>
      </Card>
    </div>
  );
}
