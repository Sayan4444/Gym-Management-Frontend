import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, Crown, Loader2, Box } from "lucide-react";
import { useMe, useAttendance } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";
import { PaginationFooter } from "@/components/PaginationFooter";

const ITEMS_PER_PAGE = 5;

export default function MemberDashboard() {
  const { data: me, isLoading: isAuthLoading } = useMe({ include: "subscription,user_addon" });
  const { data: attendanceData } = useAttendance();

  const [page, setPage] = useState(1);

  const subs = me?.subscription;
  // Loop over it and find the one which has status = "Active"
  const activeSub = subs?.find((s) => s.status === "Active");
  const plan = activeSub?.plan;

  const userAddons = me?.userAddon || [];
  const activeAddons = userAddons.filter((ua) => ua.status !== "Completed");
  const scheduledAddons = userAddons.filter((ua) => ua.status === "Scheduled" || ua.status === "In Progress").length;


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

  const kpiCards = [
    { title: "Current Plan", value: plan?.name || "No Plan", badge: activeSub?.status || "Inactive", icon: CreditCard, color: "text-[#00BFFF]", highlight: true },
    { title: "Days Remaining", value: daysLeft, icon: Clock, color: "text-amber-400" },
    { title: "Add-ons", value: activeAddons.length, badge: `${scheduledAddons} scheduled`, icon: Box, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl border border-white/5 bg-[#111111]/50 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 ${
                card.highlight ? "border-b-2 border-b-[#00BFFF]/40" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.title}</p>
                {card.badge && (
                  <span className="max-w-[120px] truncate rounded bg-[#39FF14]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#39FF14]">{card.badge}</span>
                )}
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="truncate font-mono text-2xl font-bold tracking-tight text-white" title={String(card.value)}>
                  {card.value}
                </p>
                <div className={`rounded-lg bg-white/[0.02] p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="glass-card rounded-2xl border-white/5 bg-transparent text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
            Recent Attendance
            {activeSub?.plan?.name.toLowerCase().includes("premium") && <Crown className="h-4 w-4 fill-yellow-400 text-yellow-500" />}
          </CardTitle>
          <p className="font-mono text-xs text-gray-500">Welcome, {me?.name.split(" ")[0] || "Member"}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pagedAttendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <div>
                  <p className="font-medium text-white">{formatDate(a.date)}</p>
                  <p className="text-sm text-gray-400">
                    {formatTime(a.timeIn)} – {a.timeOut ? formatTime(a.timeOut) : "In progress"}
                  </p>
                </div>
                <Badge variant={a.source === "Biometric" ? "default" : "secondary"} className={a.source === "Biometric" ? "bg-[#00BFFF] text-black" : "bg-white/10 text-white"}>
                  {a.source}
                </Badge>
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
