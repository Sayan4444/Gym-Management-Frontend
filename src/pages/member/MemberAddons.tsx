import { useState } from "react";
import { Loader2, PackagePlus, Clock, CalendarClock, CheckCircle2, Package, History } from "lucide-react";
import { useAddons, useMe } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddAddonDialog } from "@/components/member/AddAddonDialog";
import { ScheduleAddonDialog } from "@/components/member/ScheduleAddonDialog";
import type { UserAddon } from "@/data/types";
import { formatDate } from "@/lib/utils";

const statusBadgeStyles: Record<string, string> = {
  Purchased: "bg-muted text-muted-foreground border-border",
  Scheduled: "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-success/10 text-success border-success/20",
};

export default function MemberAddons() {
  const { data: me, isLoading } = useMe({
    include: "gym,subscription,user_addon",
  });

  const gymAddons = useAddons(me?.gymId)?.data?.addons || [];
  const userAddons: UserAddon[] = me?.userAddon || [];

  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };

  const { toast } = useToast();
  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<UserAddon | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Split addons by computed status
  const activeAddons = userAddons.filter((ua) => ua.status !== "Completed");
  const completedAddons = userAddons.filter((ua) => ua.status === "Completed");

  const scheduled = activeAddons.filter((ua) => ua.status === "Scheduled" || ua.status === "In Progress");
  const unscheduled = activeAddons.filter((ua) => ua.status === "Purchased");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold font-display">My Add-ons</h1>
          <p className="text-muted-foreground">
            View and schedule your purchased add-on sessions
          </p>
        </div>
        <Button onClick={() => setShowAddonDialog(true)} className="shrink-0">
          <PackagePlus className="mr-2 h-4 w-4" />
          Buy New Add-on
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Add-ons", value: userAddons.length, icon: Package },
          { label: "Scheduled", value: scheduled.length, icon: CalendarClock },
          { label: "Pending", value: unscheduled.length, icon: Clock },
          { label: "Completed", value: completedAddons.length, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-6 pb-5">
              <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons list */}
      {activeAddons.length === 0 && completedAddons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">No add-ons yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Purchase an add-on to unlock extra sessions and services.
              </p>
            </div>
            <Button onClick={() => setShowAddonDialog(true)}>
              <PackagePlus className="mr-2 h-4 w-4" />
              Buy Add-on
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Scheduled section */}
          {scheduled.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Scheduled Sessions
                </CardTitle>
                <CardDescription>These sessions have a confirmed date &amp; time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {scheduled.map((ua) => (
                  <AddonRow key={ua.id} ua={ua} onSchedule={setScheduleTarget} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Unscheduled section */}
          {unscheduled.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  Awaiting Scheduling
                </CardTitle>
                <CardDescription>Pick a date and time for these sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {unscheduled.map((ua) => (
                  <AddonRow key={ua.id} ua={ua} onSchedule={setScheduleTarget} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completed section */}
          {completedAddons.length > 0 && (
            <Card className="opacity-75">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Completed Sessions
                </CardTitle>
                <CardDescription>Past sessions that have already ended</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {completedAddons.map((ua) => (
                  <AddonRow key={ua.id} ua={ua} onSchedule={setScheduleTarget} completed />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddAddonDialog
        open={showAddonDialog}
        onOpenChange={setShowAddonDialog}
        gymAddons={gymAddons}
        prefill={prefill}
        onSuccess={() => {
          setShowAddonDialog(false);
          toast({
            title: "Payment successful!",
            description: "Your add-on has been activated.",
          });
        }}
        onError={() => {
          setShowAddonDialog(false);
          toast({
            title: "Payment failed",
            description: "Your payment could not be processed. Please try again.",
            variant: "destructive",
          });
        }}
      />

      <ScheduleAddonDialog
        userAddon={scheduleTarget}
        open={Boolean(scheduleTarget)}
        onOpenChange={(open) => {
          if (!open) setScheduleTarget(null);
        }}
      />
    </div>
  );
}

/* ─── Row component ─────────────────────────────────────────────────────────── */

function AddonRow({
  ua,
  onSchedule,
  completed = false,
}: {
  ua: UserAddon;
  onSchedule: (ua: UserAddon) => void;
  completed?: boolean;
}) {
  const scheduledDate = ua.scheduledAt
    ? new Date(ua.scheduledAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const badgeStyle = statusBadgeStyles[ua.status] || "";

  return (
    <div className={`flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40 ${completed ? "opacity-60" : ""}`}>
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {completed ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : (
          <Clock className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{ua.addon?.name ?? "Unknown Add-on"}</p>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {ua.addon?.duration ? (
            <span className="text-xs text-muted-foreground">{ua.addon.duration} min</span>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Purchased {formatDate(ua.purchasedAt)}
          </span>
          {scheduledDate && (
            <span className={`flex items-center gap-1 text-xs ${completed ? "text-muted-foreground" : "text-success"}`}>
              <CheckCircle2 className="h-3 w-3" />
              {scheduledDate}
            </span>
          )}
        </div>
      </div>

      {/* Badge + action */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className={`${badgeStyle} text-xs`}>
          {ua.status}
        </Badge>
        {!completed && (
          <Button
            size="sm"
            variant={ua.status === "Purchased" ? "default" : "outline"}
            className="gap-1.5"
            onClick={() => onSchedule(ua)}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {ua.status === "Purchased" ? "Schedule" : "Reschedule"}
          </Button>
        )}
      </div>
    </div>
  );
}
