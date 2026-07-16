import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Check, Pause, Play, RefreshCw, ShieldCheck, Trash2, XCircle } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MembershipPlan, Subscription, User } from "@/data/types";
import { useAssignSubscription, useDeleteSubscription, useUpdateSubscription } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

function statusClass(status: string) {
  if (status === "Active") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Upcoming") return "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]";
  if (status === "Paused") return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  if (status === "Cancelled" || status === "Expired") return "border-red-400/20 bg-red-400/10 text-red-300";
  return "border-white/10 bg-white/5 text-gray-300";
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
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-white">{subscription.plan?.name || `Plan #${subscription.planId}`}</p>
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-black uppercase ${statusClass(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-gray-500">
            {formatDate(subscription.startDate)} — {formatDate(subscription.endDate)} · Subscription #{subscription.id}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {subscription.status === "Paused" || subscription.status === "Cancelled" ? (
            <button
              type="button"
              onClick={() => updateStatus("", "Subscription reactivated")}
              disabled={isBusy}
              className="inline-flex items-center gap-1 rounded-lg border border-[#39FF14]/20 bg-[#39FF14]/10 px-3 py-1.5 text-[10px] font-black text-[#39FF14] disabled:opacity-50"
            >
              <Play className="h-3 w-3" /> Reactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={() => updateStatus("Paused", "Subscription paused")}
              disabled={isBusy || subscription.status === "Expired"}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-black text-amber-300 disabled:opacity-40"
            >
              <Pause className="h-3 w-3" /> Pause
            </button>
          )}
          {subscription.status !== "Cancelled" && (
            <button
              type="button"
              onClick={() => updateStatus("Cancelled", "Subscription cancelled")}
              disabled={isBusy}
              className="inline-flex items-center gap-1 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-[10px] font-black text-red-300 disabled:opacity-50"
            >
              <XCircle className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 border-t border-white/5 pt-4 sm:grid-cols-[1fr_auto_auto]">
        <select
          aria-label={`Plan for subscription ${subscription.id}`}
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
          disabled={isBusy}
          className="rounded-xl border border-white/10 bg-[#111] px-3 py-2 text-xs text-white focus:border-[#00BFFF] focus:outline-none disabled:opacity-50"
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id} className="bg-neutral-900">
              {plan.name} · {plan.durationMonths} month{plan.durationMonths === 1 ? "" : "s"}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={changePlan}
          disabled={isBusy || Number(planId) === subscription.planId}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#00BFFF]/20 bg-[#00BFFF]/10 px-3 py-2 text-[10px] font-black text-[#00BFFF] disabled:opacity-40"
        >
          <RefreshCw className="h-3 w-3" /> Change Plan
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? removeSubscription() : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-black text-red-300 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" /> {confirmDelete ? "Confirm Delete" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export function MemberAccessDialog({
  member,
  plans,
  open,
  onOpenChange,
}: {
  member: User | null;
  plans: MembershipPlan[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const assignSubscription = useAssignSubscription();
  const { toast } = useToast();
  const [planId, setPlanId] = useState("");

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);
  const subscriptions = useMemo(
    () => [...(member?.subscription || [])].sort((first, second) => new Date(second.startDate).getTime() - new Date(first.startDate).getTime()),
    [member?.subscription],
  );
  const hasCurrentOrUpcoming = subscriptions.some((subscription) => subscription.status === "Active" || subscription.status === "Upcoming");

  useEffect(() => {
    if (!open) return;
    setPlanId(activePlans[0] ? String(activePlans[0].id) : "");
  }, [activePlans, member?.id, open]);

  const assignPlan = () => {
    if (!member || !planId) return;

    assignSubscription.mutate(
      { userId: member.id, planId: Number(planId) },
      {
        onSuccess: () => {
          toast({
            title: hasCurrentOrUpcoming ? "Upcoming subscription assigned" : "Active subscription assigned",
            description: hasCurrentOrUpcoming
              ? "The plan will be provisioned when the current access term ends."
              : "The member has been sent to biometric access control.",
          });
        },
        onError: (error) => toast({ title: "Unable to assign subscription", description: error.message, variant: "destructive" }),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto border-[#00BFFF]/20 bg-[#090909] text-white shadow-[0_0_55px_rgba(0,191,255,0.14)]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[#00BFFF]/20 bg-[#00BFFF]/10 p-2 text-[#00BFFF]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-base font-black uppercase tracking-tight">Membership & Biometric Access</DialogTitle>
              <DialogDescription className="mt-1 text-xs text-gray-500">
                {member ? `${member.name} · #${member.id}` : "Manage member access"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {member && (
          <div className="space-y-5 pt-2">
            <section className="rounded-2xl border border-[#39FF14]/10 bg-[#39FF14]/[0.03] p-4">
              <div className="mb-3 flex items-start gap-3">
                <CalendarPlus className="mt-0.5 h-4 w-4 shrink-0 text-[#39FF14]" />
                <div>
                  <h3 className="text-xs font-black uppercase text-white">
                    {hasCurrentOrUpcoming ? "Assign next subscription" : "Assign active subscription"}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {hasCurrentOrUpcoming
                      ? "Because this member already has current or upcoming access, the new plan will begin after that term ends."
                      : "This plan starts immediately and provisions the member on the biometric device."}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <select
                  aria-label="Membership plan to assign"
                  value={planId}
                  onChange={(event) => setPlanId(event.target.value)}
                  disabled={assignSubscription.isPending || activePlans.length === 0}
                  className="rounded-xl border border-white/10 bg-[#111] px-3 py-2.5 text-xs text-white focus:border-[#39FF14] focus:outline-none disabled:opacity-50"
                >
                  {activePlans.length === 0 && <option value="">No active plans available</option>}
                  {activePlans.map((plan) => (
                    <option key={plan.id} value={plan.id} className="bg-neutral-900">
                      {plan.name} · ₹{plan.price.toFixed(2)} · {plan.durationMonths} month{plan.durationMonths === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={assignPlan}
                  disabled={!planId || assignSubscription.isPending}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-5 py-2.5 text-xs font-black text-black disabled:opacity-40"
                >
                  <Check className="h-3.5 w-3.5" />
                  {assignSubscription.isPending ? "Assigning..." : hasCurrentOrUpcoming ? "Queue Plan" : "Assign & Enable"}
                </button>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00BFFF]">Subscription history</h3>
                <span className="font-mono text-[10px] text-gray-600">{subscriptions.length} total</span>
              </div>

              {subscriptions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-xs text-gray-500">
                  No subscriptions assigned yet.
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
        )}
      </DialogContent>
    </Dialog>
  );
}
