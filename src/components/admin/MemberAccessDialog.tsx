import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Check, History, Pause, Play, RefreshCw, Trash2, XCircle } from "lucide-react";

import { MembershipPlan, Subscription, User } from "@/data/types";
import { useCreateSubscription, useDeleteSubscription, useUpdateSubscription } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

function statusClass(status: string) {
  if (status === "Active") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (status === "Upcoming") return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
  if (status === "Paused") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
  if (status === "Cancelled" || status === "Expired") return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";
  return "border-border bg-muted text-muted-foreground";
}

function SubscriptionAccessRow({ subscription, plans }: { subscription: Subscription; plans: MembershipPlan[] }) {
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();
  const { toast } = useToast();
  const [planId, setPlanId] = useState(String(subscription.planId));
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setPlanId(String(subscription.planId));
    setConfirmDelete(false);
  }, [subscription.id, subscription.planId]);

  const isUpdating = updateSubscription.isPending;
  const isDeleting = deleteSubscription.isPending;
  const isBusy = isUpdating || isDeleting;

  const updateStatus = (status: "Paused" | "Cancelled" | "", successTitle: string) => {
    updateSubscription.mutate(
      { id: subscription.id, data: { status } },
      {
        onSuccess: () => toast({ title: successTitle, description: "Biometric access synchronization has been requested." }),
        onError: (error) => toast({ title: "Unable to update subscription", description: error.message, variant: "destructive" }),
      },
    );
  };

  const changePlan = () => {
    const nextPlanId = Number(planId);
    if (!nextPlanId || nextPlanId === subscription.planId) return;

    updateSubscription.mutate(
      { id: subscription.id, data: { planId: nextPlanId } },
      {
        onSuccess: () => toast({ title: "Subscription plan updated", description: "Member access has been synchronized." }),
        onError: (error) => toast({ title: "Unable to change plan", description: error.message, variant: "destructive" }),
      },
    );
  };

  const removeSubscription = () => {
    deleteSubscription.mutate(subscription.id, {
      onSuccess: () => {
        setConfirmDelete(false);
        toast({ title: "Subscription deleted", description: "Remaining access was recalculated and synchronized." });
      },
      onError: (error) => toast({ title: "Unable to delete subscription", description: error.message, variant: "destructive" }),
    });
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{subscription.plan?.name || `Plan #${subscription.planId}`}</p>
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-black uppercase ${statusClass(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(subscription.startDate)} — {formatDate(subscription.endDate)} · Subscription #{subscription.id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {subscription.status === "Paused" ? (
            <button
              type="button"
              onClick={() => updateStatus("", "Subscription reactivated")}
              disabled={isBusy}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              <Play className="h-3 w-3" /> Reactivate
            </button>
          ) : subscription.status !== "Cancelled" ? (
            <button
              type="button"
              onClick={() => updateStatus("Paused", "Subscription paused")}
              disabled={isBusy || subscription.status === "Expired"}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-40 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
            >
              <Pause className="h-3 w-3" /> Pause
            </button>
          ) : null}
          {subscription.status !== "Cancelled" && (
            <button
              type="button"
              onClick={() => updateStatus("Cancelled", "Subscription cancelled")}
              disabled={isBusy}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              <XCircle className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-[1fr_auto_auto]">
        <select
          aria-label={`Plan for subscription ${subscription.id}`}
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
          disabled={isBusy}
          className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} · {plan.durationMonths} month{plan.durationMonths === 1 ? "" : "s"}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={changePlan}
          disabled={isBusy || Number(planId) === subscription.planId}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-40 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
        >
          <RefreshCw className="h-3 w-3" /> Change Plan
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? removeSubscription() : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <Trash2 className="h-3 w-3" /> {confirmDelete ? "Confirm Delete" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export function MemberAccessPanel({
  member,
  plans,
}: {
  member: User;
  plans: MembershipPlan[];
}) {
  const createSubscription = useCreateSubscription();
  const { toast } = useToast();
  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState("");

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);
  const subscriptions = useMemo(
    () => [...(member.subscription || [])].sort((first, second) => new Date(second.startDate).getTime() - new Date(first.startDate).getTime()),
    [member.subscription],
  );
  const hasCurrentOrUpcoming = subscriptions.some((subscription) => subscription.status === "Active" || subscription.status === "Upcoming");

  useEffect(() => {
    setPlanId(activePlans[0] ? String(activePlans[0].id) : "");
    setStartDate("");
  }, [activePlans, member.id]);

  const createPlan = () => {
    if (!planId) return;

    createSubscription.mutate(
      { userId: member.id, planId: Number(planId), startDate: startDate || undefined },
      {
        onSuccess: () => {
          toast({
            title: hasCurrentOrUpcoming ? "Upcoming subscription created" : "Active subscription created",
            description: hasCurrentOrUpcoming
              ? "The plan will be provisioned when the current access term ends."
              : "The member has been sent to biometric access control.",
          });
        },
        onError: (error) => toast({ title: "Unable to create subscription", description: error.message, variant: "destructive" }),
      },
    );
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <section className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="mb-3 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarPlus className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {hasCurrentOrUpcoming ? "Create next subscription" : "Create active subscription"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {hasCurrentOrUpcoming
                ? "Because this member already has current or upcoming access, the new plan will begin after that term ends."
                : "This plan starts immediately and provisions the member on the biometric device."}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
          <select
            aria-label="Membership plan for the new subscription"
            value={planId}
            onChange={(event) => setPlanId(event.target.value)}
            disabled={createSubscription.isPending || activePlans.length === 0}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            {activePlans.length === 0 && <option value="">No active plans available</option>}
            {activePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} · ₹{plan.price.toFixed(2)} · {plan.durationMonths} month{plan.durationMonths === 1 ? "" : "s"}
              </option>
            ))}
          </select>
          <input
            type="date"
            aria-label="Optional subscription start date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            disabled={createSubscription.isPending}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            title="Optional start date. Leave blank to use the next available date."
          />
          <button
            type="button"
            onClick={createPlan}
            disabled={!planId || createSubscription.isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            <Check className="h-3.5 w-3.5" />
            {createSubscription.isPending ? "Creating..." : hasCurrentOrUpcoming ? "Queue Plan" : "Create & Enable"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Start date is optional. Leave it blank to begin on the member's next available subscription date.</p>
      </section>

      <section className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Subscription history</h3>
          </div>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">{subscriptions.length} total</span>
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center text-xs text-muted-foreground">
            No subscriptions created yet.
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((subscription) => (
              <SubscriptionAccessRow key={subscription.id} subscription={subscription} plans={plans} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
