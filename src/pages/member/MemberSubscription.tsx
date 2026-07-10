import { useMemo, useState } from "react";
import { AlertCircle, CalendarCheck, Clock, CreditCard, Crown, History, Loader2, RotateCcw } from "lucide-react";

import { RenewSubscriptionDialog } from "@/components/member/RenewSubscriptionDialog";
import { useMembershipPlansByGym, useMe } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

function statusClass(status: string) {
  if (status === "Active" || status === "Paid") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Upcoming") return "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]";
  if (status === "Pending" || status === "Paused" || status === "Frozen") return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  if (status === "Expired" || status === "Cancelled" || status === "Failed") return "border-red-400/20 bg-red-400/10 text-red-400";
  return "border-white/10 bg-white/5 text-gray-300";
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] font-black uppercase ${statusClass(status)}`}>{status}</span>;
}

function DetailRow({ label, value, icon: Icon = CreditCard }: { label: string; value: string; icon?: typeof CreditCard }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.04]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00BFFF]/10">
        <Icon className="h-4 w-4 text-[#00BFFF]" />
      </div>
      <p className="min-w-0 flex-1 text-xs font-bold text-white">{label}</p>
      <p className="shrink-0 font-mono text-xs text-gray-400">{value}</p>
    </div>
  );
}

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe({ include: "gym,subscription,workout_plan,payments,user_addon" });
  const gymPlans = useMembershipPlansByGym(me?.gymId).data?.memberships || [];
  const { toast } = useToast();
  const [showAddSubscriptionDialog, setShowAddSubscriptionDialog] = useState(false);

  const subscriptions = me?.subscription || [];
  const activeSub = subscriptions.find((subscription) => subscription.status === "Active");
  const plan = activeSub?.plan;
  const upcomingSubs = subscriptions
    .filter((subscription) => subscription.status === "Upcoming")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const nextUpcomingSub = upcomingSubs[0];
  const upcomingPlan = nextUpcomingSub ? gymPlans.find((candidate) => candidate.id === nextUpcomingSub.planId) : undefined;
  const previousSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((subscription) => subscription.status !== "Active" && subscription.status !== "Upcoming")
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()),
    [subscriptions],
  );
  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };
  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="member-subscription-panel">
      <div className="glass-card flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#39FF14]/5 p-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-1 text-xl font-black uppercase tracking-tight text-white">Subscription</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAddSubscriptionDialog(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black transition-opacity hover:opacity-90"
          id="buy-subscription-btn"
        >
          <RotateCcw className="h-4 w-4" />
          Buy New Subscription
        </button>
      </div>

      {activeSub && plan ? (
        <div className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                <Crown className="h-4 w-4 text-[#39FF14]" />
                Active Subscription
              </h2>
              <p className="mt-1 text-xs text-gray-500">Your current membership plan details</p>
            </div>
            <StatusBadge status={activeSub.status} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Plan" value={plan.name} />
            <DetailRow label="Price" value={`₹${plan.price}/mo`} />
            <DetailRow label="Duration" value={`${plan.durationMonths} month(s)`} />
            <DetailRow label="Start Date" value={formatDate(activeSub.startDate)} icon={CalendarCheck} />
            <DetailRow label="End Date" value={formatDate(activeSub.endDate)} icon={Clock} />
          </div>
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0a0a0a] px-6 py-16 text-center shadow-2xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
            <AlertCircle className="h-8 w-8 text-amber-400" />
          </div>
          <p className="text-lg font-black text-white">No active subscription</p>
          <p className="mt-1 text-sm text-gray-500">Purchase a subscription to access gym facilities and services.</p>
          <button
            type="button"
            onClick={() => setShowAddSubscriptionDialog(true)}
            className="mt-5 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black"
          >
            <RotateCcw className="h-4 w-4" />
            Buy Subscription
          </button>
        </div>
      )}

      {nextUpcomingSub && upcomingPlan && (
        <div className="glass-card rounded-2xl border border-[#00BFFF]/10 bg-[#0a0a0a] p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                <Clock className="h-4 w-4 text-[#00BFFF]" />
                Upcoming Subscription
              </h2>
              <p className="mt-1 text-xs text-gray-500">Your next plan will activate automatically</p>
            </div>
            <StatusBadge status={nextUpcomingSub.status} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DetailRow label="Plan" value={upcomingPlan.name} />
            <DetailRow label="Price" value={`₹${upcomingPlan.price}/mo`} />
            <DetailRow label="Duration" value={`${upcomingPlan.durationMonths} month(s)`} />
            <DetailRow label="Start Date" value={formatDate(nextUpcomingSub.startDate)} icon={CalendarCheck} />
            <DetailRow label="End Date" value={formatDate(nextUpcomingSub.endDate)} icon={Clock} />
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
              <History className="h-4 w-4 text-[#00BFFF]" />
              Previously Bought Subscriptions
            </h2>
          </div>
        </div>

        {previousSubscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="p-4">Plan</th>
                  <th className="p-4">Bought On</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {previousSubscriptions.map((subscription) => {
                  const boughtPlan = subscription.plan || gymPlans.find((candidate) => candidate.id === subscription.planId);

                  return (
                    <tr key={subscription.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">{boughtPlan?.name || "Membership Plan"}</td>
                      <td className="p-4 font-mono text-gray-400">{formatDate(subscription.createdAt)}</td>
                      <td className="p-4 font-mono text-gray-300">{formatDate(subscription.startDate)}</td>
                      <td className="p-4 font-mono text-gray-400">{formatDate(subscription.endDate)}</td>
                      <td className="p-4 font-mono font-black text-white">{boughtPlan ? `₹${boughtPlan.price.toFixed(2)}` : "-"}</td>
                      <td className="p-4">
                        <StatusBadge status={subscription.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-10 text-center">
            <p className="text-sm font-bold text-white">No previous subscriptions found.</p>
          </div>
        )}
      </div>

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
