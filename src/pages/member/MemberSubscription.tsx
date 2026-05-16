import { useState } from "react";
import { Loader2, RotateCcw, CreditCard, Clock, CalendarCheck, Crown, AlertCircle } from "lucide-react";
import { useMe, useMembershipPlansByGym } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RenewSubscriptionDialog } from "@/components/member/RenewSubscriptionDialog";
import { formatDate } from "@/lib/utils";

function statusBadge(status: string) {
  const cls: Record<string, string> = {
    Active: "bg-success/10 text-success border-success/20",
    Expired: "bg-destructive/10 text-destructive border-destructive/20",
    Frozen: "bg-warning/10 text-warning border-warning/20",
    Upcoming: "bg-primary/10 text-primary border-primary/20",
    Paid: "bg-success/10 text-success border-success/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Failed: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <Badge variant="outline" className={`${cls[status] || ""} text-xs`}>
      {status}
    </Badge>
  );
}

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe({ include: "gym,subscription,workout_plan,payments,user_addon" });

  const gymPlans = useMembershipPlansByGym(me?.gymId)?.data?.memberships || [];

  const subs = me?.subscription;
  // Loop over it and find the one which has status = "Active"
  const activeSub = subs?.find((s) => s.status === "Active");
  const plan = activeSub?.plan;

  const upcomingSubs = subs?.filter((s) => s.status === "Upcoming")?.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const nextUpcomingSub = upcomingSubs?.[0];
  const upcomingPlan = nextUpcomingSub ? gymPlans.find(p => p.id === nextUpcomingSub.planId) : undefined;

  const { toast } = useToast();

  const [showAddSubscriptionDialog, setShowAddSubscriptionDialog] = useState(false);

  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };

  const daysLeft = activeSub
    ? Math.max(0, Math.ceil((new Date(activeSub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold font-display">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your membership plan and renewals
          </p>
        </div>
        <Button onClick={() => setShowAddSubscriptionDialog(true)} className="shrink-0">
          <RotateCcw className="mr-2 h-4 w-4" />
          Buy New Subscription
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Current Plan", value: plan?.name || "No Plan", icon: CreditCard },
          { label: "Days Remaining", value: daysLeft, icon: Clock },
          { label: "Status", value: activeSub?.status || "Inactive", icon: CalendarCheck, isBadge: true },
        ].map(({ label, value, icon: Icon, isBadge }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-6 pb-5">
              <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              {isBadge && typeof value === "string" ? (
                <div className="flex justify-center mt-1">{statusBadge(value)}</div>
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription details */}
      {activeSub && plan ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              Active Subscription
            </CardTitle>
            <CardDescription>Your current membership plan details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DetailRow label="Plan" value={plan.name} />
              <DetailRow label="Price" value={`₹${plan.price}/mo`} />
              <DetailRow label="Duration" value={`${plan.durationMonths} month(s)`} />
              <DetailRow label="Start Date" value={formatDate(activeSub.startDate)} />
              <DetailRow label="End Date" value={formatDate(activeSub.endDate)} />
              <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Status</p>
                </div>
                <div className="shrink-0">
                  {statusBadge(activeSub.status)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">No active subscription</p>
              <p className="text-muted-foreground text-sm mt-1">
                Purchase a subscription to access gym facilities and services.
              </p>
            </div>
            <Button onClick={() => setShowAddSubscriptionDialog(true)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Buy Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming subscription */}
      {nextUpcomingSub && upcomingPlan && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Upcoming Subscription
            </CardTitle>
            <CardDescription>Your next plan will activate automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DetailRow label="Plan" value={upcomingPlan.name} />
              <DetailRow label="Price" value={`₹${upcomingPlan.price}/mo`} />
              <DetailRow label="Duration" value={`${upcomingPlan.durationMonths} month(s)`} />
              <DetailRow label="Start Date" value={formatDate(nextUpcomingSub.startDate)} />
              <DetailRow label="End Date" value={formatDate(nextUpcomingSub.endDate)} />
              <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Status</p>
                </div>
                <div className="shrink-0">
                  {statusBadge(nextUpcomingSub.status)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <RenewSubscriptionDialog
        open={showAddSubscriptionDialog}
        onOpenChange={setShowAddSubscriptionDialog}
        gymPlans={gymPlans}
        prefill={prefill}
        onSuccess={() => {
          setShowAddSubscriptionDialog(false);
          toast({ title: "Payment successful!", description: "Your subscription has been renewed." });
        }}
        onError={() => {
          setShowAddSubscriptionDialog(false);
          toast({ title: "Payment failed", description: "Your payment could not be processed. Please try again.", variant: "destructive" });
        }}
      />
    </div>
  );
}

/* ─── Row component ─────────────────────────────────────────────────────────── */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <CreditCard className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
      </div>
      <div className="shrink-0">
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
