import { useMemo } from "react";
import { motion } from "motion/react";
import { HelpCircle, Loader2, ShieldCheck } from "lucide-react";

import { RazorpayButton } from "@/components/RazorpayButton";
import type { MembershipPlan, PlanAddon } from "@/data/types";
import { useMembershipPlansByGym, useMe } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);

const formatDuration = (months: number) => `${months} ${months === 1 ? "Month" : "Months"}`;

const getPlanBadge = (plan: MembershipPlan) =>
  plan.planIcon === "⭐" ? "VIP PREMIUM" : "STANDARD INDUCTION";

const addonLabel = (planAddon: PlanAddon) => {
  const suffix = planAddon.frequency ? ` (${planAddon.frequency})` : "";
  return `${planAddon.addon?.name ?? `Addon #${planAddon.addonId}`}${suffix}`;
};

function PlanBenefits({ plan, isVip }: { plan: MembershipPlan; isVip: boolean }) {
  const planAddons = plan.planAddons ?? [];

  if (planAddons.length === 0) {
    return (
      <div className="flex items-start gap-2 text-[11px] text-gray-500">
        <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
        <span className="leading-tight">No included add-ons configured</span>
      </div>
    );
  }

  return planAddons.map((planAddon) => (
    <div
      key={planAddon.id}
      className="flex items-start gap-2 text-[11px] text-gray-400 transition-colors group-hover:text-gray-300"
    >
      <ShieldCheck className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isVip ? "text-[#E5A823]" : "text-[#39FF14]"}`} />
      <span className="leading-tight">{addonLabel(planAddon)}</span>
    </div>
  ));
}

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe({
    include: "gym,subscription,workout_plan,payments,user_addon",
  });
  const plansQuery = useMembershipPlansByGym(me?.gymId);
  const { toast } = useToast();

  const plans = useMemo(
    () => [...(plansQuery.data?.memberships ?? [])].filter((plan) => plan.isActive).sort((a, b) => a.id - b.id),
    [plansQuery.data?.memberships],
  );
  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };

  if (isAuthLoading || (Boolean(me?.gymId) && plansQuery.isLoading)) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="member-subscription-panel">
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/5 bg-[#0d0d0d] p-5 shadow-xl sm:flex-row sm:items-center">
        <h1 className="font-display text-2xl font-black tracking-tight text-white">Gym Membership Plans</h1>
        <span className="w-fit rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1.5 text-xs font-bold text-white shadow">
          Plans ({plans.length})
        </span>
      </div>

      {plansQuery.isError ? (
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-8 text-center text-sm text-red-300">
          Membership plans could not be loaded. Please try again.
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f0f0f]/65 p-8 text-center text-sm text-gray-400">
          No membership plans are currently open for enrollment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const isVip = plan.planIcon === "⭐";
            const glowClass = isVip
              ? "border-[#E5A823]/30 bg-gradient-to-b from-[#16120c]/80 to-[#0a0805]/95 shadow-[0_0_25px_rgba(229,168,35,0.06)] hover:border-[#E5A823]/50 lg:scale-[1.01]"
              : "border-white/5 bg-[#0f0f0f]/65 hover:border-white/10";
            const subtitleColor = isVip
              ? "text-[#E5A823] font-extrabold tracking-widest"
              : "text-gray-400 font-bold";
            const borderBottomGlow = isVip ? "border-b-2 border-b-[#E5A823]/40" : "";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${glowClass} ${borderBottomGlow}`}
                id={`member-plan-card-${plan.id}`}
              >
                {isVip && (
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#E5A823]/15 to-transparent blur-2xl" />
                )}

                <div>
                  <div className="mb-4 flex items-start justify-between border-b border-white/[0.04] pb-3">
                    <div className="min-w-0">
                      <span className={`font-mono text-[9.5px] uppercase ${subtitleColor}`}>{getPlanBadge(plan)}</span>
                      <h2
                        className="mt-1 truncate text-sm font-black leading-tight tracking-tight text-white group-hover:text-white/95"
                        title={plan.name}
                      >
                        {plan.planIcon ? <span className="mr-1.5">{plan.planIcon}</span> : null}
                        {plan.name}
                      </h2>
                    </div>
                    <span className="ml-2 shrink-0 rounded border border-[#39FF14]/15 bg-[#39FF14]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-[#39FF14]">
                      Active
                    </span>
                  </div>

                  <div className="mb-4 flex items-center justify-between border-b border-white/[0.03] py-1 font-mono">
                    <span className="text-[10px] uppercase text-gray-500">Term</span>
                    <span className="border-b border-[#39FF14]/30 text-xs font-black text-white">
                      {formatDuration(plan.durationMonths).toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-black tracking-tight text-white">₹{formatCurrency(plan.price)}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded border border-emerald-500/15 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-current" />
                      <span>Enrollment currently open</span>
                    </div>
                  </div>

                  {plan.description && <p className="mb-4 text-xs text-gray-400">{plan.description}</p>}

                  {isVip && (
                    <div className="mb-4 rounded-lg border border-[#E5A823]/10 bg-gradient-to-r from-[#E5A823]/10 to-transparent p-2">
                      <p className="flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#E5A823]">
                        <span>★ VIP Perks:</span>
                        <span className="text-white">Premium add-on bundle enabled</span>
                      </p>
                    </div>
                  )}

                  <div className="mb-5 space-y-2">
                    <PlanBenefits plan={plan} isVip={isVip} />
                  </div>
                </div>

                <div className="mt-auto border-t border-white/[0.04] pt-3">
                  <RazorpayButton
                    item={plan}
                    type="Membership Plan"
                    prefill={prefill}
                    onSuccess={() =>
                      toast({ title: "Payment successful!", description: `${plan.name} has been added to your subscriptions.` })
                    }
                    onError={() =>
                      toast({
                        title: "Payment failed",
                        description: "Your payment could not be processed. Please try again.",
                        variant: "destructive",
                      })
                    }
                    className="h-auto w-full rounded-lg bg-gradient-to-r from-[#00BFFF] to-[#39FF14] py-2 text-[11px] font-black text-black shadow-none hover:opacity-90"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
