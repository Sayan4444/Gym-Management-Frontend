import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import EmojiPicker from "emoji-picker-react";
import {
  Edit,
  HelpCircle,
  Package,
  Plus,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  useAddons,
  useAddPlanAddon,
  useCreateMembershipPlan,
  useDeleteMembershipPlan,
  useMe,
  useMembershipPlans,
  useRemovePlanAddon,
  useSubscriptions,
  useUpdateMembershipPlan,
  useUpdatePlanAddon,
  useCreateAddon,
  useUpdateAddon,
  useDeleteAddon,
} from "@/hooks/useApi";
import { MembershipPlan, PlanAddon, Addon } from "@/data/types";

type LocalPlanAddon = Omit<PlanAddon, "frequency"> & { frequency: string; _isNew?: boolean };
type CategoryFilter = "plans" | "addons";
type PlanForm = {
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
  planIcon: string | null;
};

const defaultPlanForm: PlanForm = {
  name: "",
  description: "",
  price: 3999,
  durationMonths: 3,
  isActive: true,
  planIcon: null,
};

const durationOptions = [1, 3, 6, 12];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);

const formatDuration = (months: number) => `${months} ${months === 1 ? "Month" : "Months"}`;

const getPlanBadge = (plan: MembershipPlan) => {
  const isVip = plan.planIcon === "⭐";
  return isVip ? "VIP PREMIUM" : "STANDARD INDUCTION";
};

const isActiveSubscription = (status: string) => {
  const normalized = status.toLowerCase();
  return normalized === "active" || normalized === "current" || normalized === "ongoing";
};

const buildPlanAddons = (plan: MembershipPlan) => plan.planAddons ?? [];

const addonLabel = (planAddon: LocalPlanAddon | PlanAddon) => {
  const suffix = planAddon.frequency ? ` (${planAddon.frequency})` : "";
  return `${planAddon.addon?.name ?? `Addon #${planAddon.addonId}`}${suffix}`;
};

export default function MembershipPlansPage() {
  const { data: user } = useMe();
  const gymId = user?.gymId as number | undefined;
  const { toast } = useToast();

  const plansQuery = useMembershipPlans();
  const addonsQuery = useAddons();
  const subscriptionsQuery = useSubscriptions(gymId);

  const plans = useMemo(
    () => [...(plansQuery.data?.memberships || [])].sort((a, b) => a.id - b.id),
    [plansQuery.data?.memberships]
  );
  const addons = useMemo(
    () => [...(addonsQuery.data?.addons || [])].sort((a, b) => a.id - b.id),
    [addonsQuery.data?.addons]
  );
  const subscriptions = subscriptionsQuery.data?.subscriptions || [];

  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();
  const addPlanAddon = useAddPlanAddon();
  const updatePlanAddon = useUpdatePlanAddon();
  const removePlanAddon = useRemovePlanAddon();
  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("plans");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAddonDialogOpen, setIsAddonDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [addonForm, setAddonForm] = useState({ name: "", description: "", price: 0, isActive: true });
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planForm, setPlanForm] = useState<PlanForm>(defaultPlanForm);
  const [localPlanAddons, setLocalPlanAddons] = useState<LocalPlanAddon[]>([]);
  const [newPlanAddonId, setNewPlanAddonId] = useState("");
  const [newPlanAddonFrequency, setNewPlanAddonFrequency] = useState("");
  const [pendingDeletePlan, setPendingDeletePlan] = useState<MembershipPlan | null>(null);

  const activeMembersByPlan = useMemo(() => {
    const counts = new Map<number, number>();
    subscriptions.forEach((subscription) => {
      if (!subscription.planId || !isActiveSubscription(subscription.status)) return;
      counts.set(subscription.planId, (counts.get(subscription.planId) || 0) + 1);
    });
    return counts;
  }, [subscriptions]);

  const filteredPlans = plans;

  const attachedAddonIds = new Set(localPlanAddons.map((planAddon) => planAddon.addonId));
  const availableAddons = addons.filter((addon) => addon.isActive && !attachedAddonIds.has(addon.id));
  const isSaving =
    createPlan.isPending ||
    updatePlan.isPending ||
    addPlanAddon.isPending ||
    removePlanAddon.isPending ||
    updatePlanAddon.isPending;
  const isDeleting = deletePlan.isPending;
  const durationChoices = useMemo(
    () => [...new Set([...durationOptions, planForm.durationMonths].filter((months) => Number.isFinite(months) && months > 0))].sort((a, b) => a - b),
    [planForm.durationMonths]
  );

  const resetAddonInputs = () => {
    setNewPlanAddonId("");
    setNewPlanAddonFrequency("");
  };

  const handleOpenPlanDialog = (plan?: MembershipPlan) => {
    if (plan) {
      const latestPlan = plans.find((candidate) => candidate.id === plan.id) ?? plan;
      setEditingPlan(latestPlan);
      setPlanForm({
        name: latestPlan.name,
        description: latestPlan.description ?? "",
        price: latestPlan.price,
        durationMonths: latestPlan.durationMonths,
        isActive: latestPlan.isActive,
        planIcon: latestPlan.planIcon ?? null,
      });
      setLocalPlanAddons(
        buildPlanAddons(latestPlan).map((planAddon) => ({ ...planAddon, frequency: String(planAddon.frequency) }))
      );
    } else {
      setEditingPlan(null);
      setPlanForm(defaultPlanForm);
      setLocalPlanAddons([]);
    }
    resetAddonInputs();
    setIsPlanDialogOpen(true);
  };

  const handleLocalAddPlanAddon = () => {
    const frequency = parseInt(newPlanAddonFrequency, 10);
    if (!newPlanAddonId || !newPlanAddonFrequency.trim() || Number.isNaN(frequency) || frequency <= 0) return;

    const addonId = parseInt(newPlanAddonId, 10);
    const addon = addons.find((candidate) => candidate.id === addonId);
    setLocalPlanAddons((current) => [
      ...current,
      {
        id: -Date.now(),
        createdAt: "",
        updatedAt: "",
        planId: editingPlan?.id ?? 0,
        addonId,
        frequency: newPlanAddonFrequency.trim(),
        addon,
        _isNew: true,
      },
    ]);
    resetAddonInputs();
  };

  const handleSavePlan = async () => {
    if (!gymId) {
      toast({ title: "Gym context unavailable", description: "Please sign in again before saving plans.", variant: "destructive" });
      return;
    }
    if (!planForm.name.trim()) {
      toast({ title: "Plan name is required", variant: "destructive" });
      return;
    }

    try {
      let savedPlanId: number | undefined;
      const data = {
        ...planForm,
        name: planForm.name.trim(),
        description: planForm.description.trim() || undefined,
        price: Number(planForm.price) || 0,
        durationMonths: Number(planForm.durationMonths) || 1,
      };

      if (editingPlan) {
        await updatePlan.mutateAsync({ gymId, membershipId: editingPlan.id, data });
        savedPlanId = editingPlan.id;
      } else {
        const created = await createPlan.mutateAsync({ gymId, data: data as MembershipPlan });
        savedPlanId = (created as MembershipPlan).id;
      }

      if (editingPlan && savedPlanId) {
        const original = buildPlanAddons(plans.find((plan) => plan.id === editingPlan.id) ?? editingPlan);
        const originalMap = new Map(original.map((planAddon) => [planAddon.id, planAddon]));
        const newItems = localPlanAddons.filter((planAddon) => planAddon._isNew);
        const persistedLocalIds = new Set(localPlanAddons.filter((planAddon) => !planAddon._isNew).map((planAddon) => planAddon.id));
        const removedItems = original.filter((planAddon) => !persistedLocalIds.has(planAddon.id));
        const updatedItems = localPlanAddons.filter((planAddon) => {
          if (planAddon._isNew) return false;
          return originalMap.get(planAddon.id)?.frequency !== parseInt(planAddon.frequency, 10);
        });

        await Promise.all([
          ...newItems.map((planAddon) =>
            addPlanAddon.mutateAsync({
              gymId,
              membershipId: savedPlanId!,
              addonId: planAddon.addonId,
              frequency: parseInt(planAddon.frequency, 10),
            })
          ),
          ...removedItems.map((planAddon) =>
            removePlanAddon.mutateAsync({ gymId, membershipId: savedPlanId!, planAddonId: planAddon.id })
          ),
          ...updatedItems.map((planAddon) =>
            updatePlanAddon.mutateAsync({
              gymId,
              membershipId: savedPlanId!,
              planAddonId: planAddon.id,
              frequency: parseInt(planAddon.frequency, 10),
            })
          ),
        ]);
      }

      toast({ title: editingPlan ? "Plan updated successfully" : "Plan created successfully" });
      setIsPlanDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Error saving plan", description: message, variant: "destructive" });
    }
  };

  const handleDeletePlan = () => {
    if (!gymId || !pendingDeletePlan) return;
    deletePlan.mutate(
      { gymId, membershipId: pendingDeletePlan.id },
      {
        onSuccess: () => {
          toast({ title: "Plan deleted successfully" });
          setPendingDeletePlan(null);
        },
        onError: (error) => toast({ title: "Error deleting plan", description: error.message, variant: "destructive" }),
      }
    );
  };

  const handleOpenAddonDialog = (addon?: Addon) => {
    if (addon) {
      setEditingAddon(addon);
      setAddonForm({ name: addon.name, description: addon.description || "", price: addon.price, isActive: addon.isActive });
    } else {
      setEditingAddon(null);
      setAddonForm({ name: "", description: "", price: 0, isActive: true });
    }
    setIsAddonDialogOpen(true);
  };

  const handleSaveAddon = () => {
    if (!gymId) return;
    if (editingAddon) {
      updateAddon.mutate(
        { gymId, addonId: editingAddon.id, data: { ...editingAddon, ...addonForm } as unknown as Addon },
        {
          onSuccess: () => { toast({ title: "Add-on updated successfully" }); setIsAddonDialogOpen(false); },
          onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
        }
      );
    } else {
      createAddon.mutate(
        { gymId, data: { ...addonForm, duration: 0 } as unknown as Addon },
        {
          onSuccess: () => { toast({ title: "Add-on created successfully" }); setIsAddonDialogOpen(false); setAddonForm({ name: "", description: "", price: 0, isActive: true }); },
          onError: (error) => toast({ title: "Error creating add-on", description: error.message, variant: "destructive" }),
        }
      );
    }
  };

  const handleDeleteAddon = (id: number) => {
    if (!gymId || !confirm("Are you sure you want to delete this add-on?")) return;
    deleteAddon.mutate(
      { gymId, addonId: id },
      {
        onSuccess: () => toast({ title: "Add-on deleted successfully" }),
        onError: (error) => toast({ title: "Error deleting add-on", description: error.message, variant: "destructive" }),
      }
    );
  };

  const handleToggleAddon = (addon: Addon, checked: boolean) => {
    if (!gymId) return;
    updateAddon.mutate(
      { gymId, addonId: addon.id, data: { ...addon, isActive: checked } as unknown as Addon },
      {
        onSuccess: () => toast({ title: `Add-on ${checked ? "activated" : "deactivated"}` }),
        onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
      }
    );
  };

  const renderPlanBenefits = (plan: MembershipPlan, isVip: boolean) => {
    const planAddons = buildPlanAddons(plan);
    if (planAddons.length === 0) {
      return (
        <div className="flex gap-2 items-start text-[11px] text-gray-500">
          <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
          <span className="leading-tight">No included add-ons configured</span>
        </div>
      );
    }

    return planAddons.map((planAddon) => (
      <div key={planAddon.id} className="flex gap-2 items-start text-[11px] text-gray-400 transition-colors group-hover:text-gray-300">
        <ShieldCheck className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isVip ? "text-[#E5A823]" : "text-[#39FF14]"}`} />
        <span className="leading-tight">{addonLabel(planAddon)}</span>
      </div>
    ));
  };

  const renderFacilityCards = () => {
    const displayAddons = selectedCategory === "addons" ? addons : addons.filter((addon) => addon.isActive).slice(0, 4);

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayAddons.map((addon, index) => {
          const themes = ["#E5A823", "#00BFFF", "#fb923c", "#39FF14"];
          const color = themes[index % themes.length];
          return (
            <div key={addon.id} className="group flex flex-col justify-between relative rounded-xl border border-white/5 bg-black/45 p-4 transition-all hover:border-white/15">
              <div>
                <div className="mb-3 flex items-start justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                    {addon.duration ? `${addon.duration} MIN SERVICE` : "ADD-ON SERVICE"}
                  </span>
                  <Switch checked={addon.isActive} onCheckedChange={(c) => handleToggleAddon(addon, c)} className="scale-75" />
                </div>
                <h4 className="text-sm font-extrabold text-white">{addon.name}</h4>
                {addon.description && <p className="mb-3 mt-1 text-[10px] text-gray-400">{addon.description}</p>}
                <div className="mb-4 flex items-baseline gap-2 font-mono">
                  <span className="text-lg font-black text-[#39FF14]">₹{formatCurrency(addon.price)}/-</span>
                  <span className="text-[9px] text-gray-400">/ Session</span>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-end gap-2 border-t border-white/[0.04] pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenAddonDialog(addon)}
                  className="rounded-lg border border-white/5 bg-white/[0.01] p-1.5 text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                  title="Edit Add-On"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAddon(addon.id)}
                  className="rounded-lg border border-white/5 bg-white/[0.01] p-1.5 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                  title="Remove Add-On"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="plans-control-panel">
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/5 bg-[#0d0d0d] p-5 shadow-xl lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h3 className="font-display text-2xl font-black tracking-tight text-white">Gym Membership Plans</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-1">
            {([
              ["plans", `Plans (${plans.length})`],
              ["addons", `Addons (${addons.length})`],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedCategory(value as CategoryFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === value
                    ? value === "addons"
                      ? "border border-[#00BFFF]/20 bg-gradient-to-r from-[#00BFFF]/20 to-[#00BFFF]/10 text-[#00BFFF]"
                      : "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedCategory === "addons" ? (
            <button
              type="button"
              onClick={() => handleOpenAddonDialog()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2 text-xs font-black text-black shadow-lg transition-all hover:shadow-[0_0_15px_rgba(0,191,255,0.4)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span>Add Addon</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenPlanDialog()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2 text-xs font-black text-black shadow-lg transition-all hover:shadow-[0_0_15px_rgba(0,191,255,0.4)]"
              id="add-plan-btn"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span>Create Package</span>
            </button>
          )}
        </div>
      </div>

      {selectedCategory !== "addons" && (
        plansQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-2xl border border-white/5 bg-[#0f0f0f]/65" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0f0f0f]/65 p-8 text-center text-sm text-gray-400">
            No membership plans found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredPlans.map((plan, index) => {
              const isVip = plan.planIcon === "⭐";
              const activeMemberCount = activeMembersByPlan.get(plan.id) || 0;
              const glowClass = isVip
                ? "border-[#E5A823]/30 bg-gradient-to-b from-[#16120c]/80 to-[#0a0805]/95 shadow-[0_0_25px_rgba(229,168,35,0.06)] hover:border-[#E5A823]/50 lg:scale-[1.01]"
                : "border-white/5 bg-[#0f0f0f]/65 hover:border-white/10";
              const subtitleColor = isVip ? "text-[#E5A823] font-extrabold tracking-widest" : "text-gray-400 font-bold";
              const borderBottomGlow = isVip ? "border-b-2 border-b-[#E5A823]/40" : "";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${glowClass} ${borderBottomGlow}`}
                id={`plan-card-${plan.id}`}
              >
                {isVip && <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#E5A823]/15 to-transparent blur-2xl" />}

                <div>
                  <div className="mb-4 flex items-start justify-between border-b border-white/[0.04] pb-3">
                    <div className="min-w-0">
                      <span className={`font-mono text-[9.5px] uppercase ${subtitleColor}`}>{getPlanBadge(plan)}</span>
                      <h3 className="mt-1 truncate text-sm font-black leading-tight tracking-tight text-white group-hover:text-white/95" title={plan.name}>
                        {plan.planIcon ? <span className="mr-1.5">{plan.planIcon}</span> : null}
                        {plan.name}
                      </h3>
                    </div>
                    <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        isVip ? "border-[#E5A823]/15 bg-[#E5A823]/5 text-[#E5A823]" : "border-[#00BFFF]/15 bg-[#00BFFF]/5 text-[#00BFFF]"
                      }`}>
                        #{plan.id}
                      </span>
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        plan.isActive ? "border-[#39FF14]/15 bg-[#39FF14]/10 text-[#39FF14]" : "border-red-400/15 bg-red-400/10 text-red-300"
                      }`}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between border-b border-white/[0.03] py-1 font-mono">
                    <span className="text-[10px] uppercase text-gray-500">Term</span>
                    <span className="border-b border-[#39FF14]/30 text-xs font-black text-white">{formatDuration(plan.durationMonths).toUpperCase()}</span>
                  </div>

                  <div className="mb-4 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-black tracking-tight text-white">₹{formatCurrency(plan.price)}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] ${
                      plan.isActive ? "border border-emerald-500/15 bg-emerald-500/10 text-emerald-400" : "border border-red-500/10 bg-red-500/10 text-red-400"
                    }`}>
                      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-current" />
                      <span>{plan.isActive ? "Enrollment currently open" : "Enrollment paused"}</span>
                    </div>
                  </div>

                  {plan.description && (
                    <div className="mb-4 text-xs text-gray-400">
                      {plan.description}
                    </div>
                  )}

                  {isVip && (
                    <div className="mb-4 rounded-lg border border-[#E5A823]/10 bg-gradient-to-r from-[#E5A823]/10 to-transparent p-2">
                      <p className="flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#E5A823]">
                        <span>★ VIP Perks:</span>
                        <span className="text-white">Premium add-on bundle enabled</span>
                      </p>
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.02] bg-white/[0.01] p-2.5">
                    <span className="text-[9px] uppercase text-gray-500">Athletes Enrolled</span>
                    <span className="font-mono text-[10px] font-semibold text-gray-300">{activeMemberCount} Joined</span>
                  </div>

                  <div className="mb-5 space-y-2">{renderPlanBenefits(plan, isVip)}</div>
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-white/[0.04] pt-3">
                  <button
                    type="button"
                    onClick={() => handleOpenPlanDialog(plan)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/5 bg-white/[0.01] py-1.5 text-[11px] font-bold text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeletePlan(plan)}
                    className="rounded-lg border border-white/5 bg-white/[0.01] p-1.5 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                    title="Remove Plan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        )
      )}

      {selectedCategory === "addons" && (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0b0b0b] p-5 shadow-2xl" id="other-facilities-flyer">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E5A823]/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#00BFFF]/5 blur-3xl" />

        {renderFacilityCards()}
        </div>
      )}

      <AnimatePresence>
        {isPlanDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#090909] p-6 shadow-2xl ${
                editingPlan ? "border border-white/10" : "border border-[#00BFFF]/35"
              }`}
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  {editingPlan ? `Modifying Membership Tier - #${editingPlan.id}` : "Create Custom Membership Plan"}
                </h3>
                <button type="button" onClick={() => setIsPlanDialogOpen(false)} className="rounded bg-white/5 p-1 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-end gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-400">Icon</Label>
                    <div className="flex items-center gap-2">
                      <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-10 w-12 border-white/10 bg-white/[0.02] p-0 text-xl text-white hover:bg-white/5" title="Choose Emoji">
                            {planForm.planIcon || <SmilePlus className="h-5 w-5 text-gray-500" />}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto border-none p-0 shadow-none" side="right" align="start">
                          <EmojiPicker
                            onEmojiClick={(emojiData) => {
                              setPlanForm({ ...planForm, planIcon: emojiData.emoji });
                              setIsEmojiPickerOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {planForm.planIcon && (
                        <button type="button" className="rounded bg-white/5 p-2 text-gray-400 hover:text-white" onClick={() => setPlanForm({ ...planForm, planIcon: null })}>
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="font-bold text-gray-400">Plan Name *</Label>
                    <Input
                      required
                      value={planForm.name}
                      onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })}
                      placeholder="e.g. Gold Executive Shred"
                      className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-bold text-gray-400">Description</Label>
                  <Textarea
                    value={planForm.description}
                    onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })}
                    placeholder="Provide details about the plan..."
                    className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-400">Duration *</Label>
                    <Select value={String(planForm.durationMonths)} onValueChange={(value) => setPlanForm({ ...planForm, durationMonths: parseInt(value, 10) })}>
                      <SelectTrigger className="rounded-lg border-white/10 bg-white/[0.02] text-white focus:ring-[#00BFFF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationChoices.map((months) => (
                          <SelectItem key={months} value={String(months)}>{formatDuration(months)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-400">Price (₹ INR) *</Label>
                    <Input
                      type="number"
                      required
                      value={planForm.price}
                      onChange={(event) => setPlanForm({ ...planForm, price: parseFloat(event.target.value || "0") })}
                      className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div>
                      <p className="font-bold text-white">Enrollment Status</p>
                      <p className="text-[10px] text-gray-500">Controls whether members can be assigned to this plan.</p>
                    </div>
                    <Switch checked={planForm.isActive} onCheckedChange={(checked) => setPlanForm({ ...planForm, isActive: checked })} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E5A823]/20 bg-[#E5A823]/5 p-3">
                    <div>
                      <p className="font-bold text-[#E5A823]">VIP Package</p>
                      <p className="text-[10px] text-[#E5A823]/70">Mark this plan as a VIP premium package.</p>
                    </div>
                    <Switch checked={planForm.planIcon === "⭐"} onCheckedChange={(checked) => setPlanForm({ ...planForm, planIcon: checked ? "⭐" : planForm.planIcon === "⭐" ? null : planForm.planIcon })} />
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <Label className="text-sm font-semibold text-white">Included Add-Ons</Label>
                  </div>

                  {editingPlan ? (
                    <>
                      {localPlanAddons.length > 0 ? (
                        <div className="space-y-2">
                          {localPlanAddons.map((planAddon) => (
                            <div key={planAddon.id} className={`flex items-center gap-2 rounded-lg border p-2 ${
                              planAddon._isNew ? "border-dashed border-[#00BFFF]/40 bg-[#00BFFF]/5" : "border-white/5 bg-white/[0.02]"
                            }`}>
                              <span className="flex-1 text-sm font-medium text-gray-200">
                                {planAddon.addon?.name ?? `Addon #${planAddon.addonId}`}
                                {planAddon._isNew && <span className="ml-2 text-xs font-normal text-[#00BFFF]">unsaved</span>}
                              </span>
                              <Input
                                type="number"
                                min={1}
                                className="h-8 w-24 border-white/10 bg-black/30 text-xs text-white"
                                placeholder="Count"
                                value={planAddon.frequency}
                                onChange={(event) =>
                                  setLocalPlanAddons((current) =>
                                    current.map((candidate) => (candidate.id === planAddon.id ? { ...candidate, frequency: event.target.value } : candidate))
                                  )
                                }
                              />
                              <button
                                type="button"
                                className="rounded bg-white/5 p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                onClick={() => setLocalPlanAddons((current) => current.filter((candidate) => candidate.id !== planAddon.id))}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg border border-dashed border-white/10 p-3 text-sm text-gray-500">No add-ons included in this plan yet.</p>
                      )}

                      {availableAddons.length > 0 && (
                        <div className="flex items-end gap-2 pt-1">
                          <div className="grid flex-1 gap-1">
                            <Label className="text-xs text-gray-500">Add-On</Label>
                            <Select value={newPlanAddonId} onValueChange={setNewPlanAddonId}>
                              <SelectTrigger className="h-9 border-white/10 bg-white/[0.02] text-white">
                                <SelectValue placeholder="Select add-on" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableAddons.map((addon) => (
                                  <SelectItem key={addon.id} value={String(addon.id)}>
                                    {addon.name} - ₹{addon.price.toFixed(2)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid w-24 gap-1">
                            <Label className="text-xs text-gray-500">Count</Label>
                            <Input
                              type="number"
                              min={1}
                              className="h-9 border-white/10 bg-white/[0.02] text-white"
                              value={newPlanAddonFrequency}
                              onChange={(event) => setNewPlanAddonFrequency(event.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            className="flex h-9 items-center gap-1 rounded-lg bg-white/5 px-3 text-xs font-black text-white hover:bg-white/10 disabled:opacity-40"
                            disabled={!newPlanAddonId || !newPlanAddonFrequency.trim() || parseInt(newPlanAddonFrequency, 10) <= 0 || Number.isNaN(parseInt(newPlanAddonFrequency, 10))}
                            onClick={handleLocalAddPlanAddon}
                          >
                            <Plus className="h-4 w-4" /> Add
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="rounded-lg border border-[#00BFFF]/15 bg-[#00BFFF]/5 p-3 text-[11px] text-gray-400">
                      <Package className="mr-1 inline h-3 w-3" />
                      Create the plan first, then edit it to attach backend add-ons.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setIsPlanDialogOpen(false)} disabled={isSaving} className="rounded-xl border border-white/5 px-5 py-2.5 text-gray-400 hover:text-white disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSavePlan} disabled={isSaving} className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black disabled:opacity-60">
                    {isSaving ? "Saving..." : editingPlan ? "Apply Configurations" : "Publish Package"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDeletePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#090909] text-white shadow-[0_0_55px_rgba(239,68,68,0.18)]"
            >
              <div className="relative border-b border-red-500/10 bg-gradient-to-br from-red-500/15 via-[#090909] to-[#090909] p-5">
                <button type="button" onClick={() => setPendingDeletePlan(null)} className="absolute right-4 top-4 rounded-lg bg-white/5 p-1.5 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
                  <Trash2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-black tracking-tight">Delete membership plan?</h3>
                <p className="mt-2 text-sm text-gray-400">This removes the plan from the admin catalog and cannot be undone.</p>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{pendingDeletePlan.name}</p>
                    <p className="font-mono text-[11px] text-gray-500">₹{formatCurrency(pendingDeletePlan.price)} / {formatDuration(pendingDeletePlan.durationMonths)}</p>
                  </div>
                  <span className="rounded border border-red-400/15 bg-red-400/10 px-2 py-1 font-mono text-[10px] font-bold text-red-300">#{pendingDeletePlan.id}</span>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setPendingDeletePlan(null)} disabled={isDeleting} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-white/5 disabled:opacity-50">
                    Keep Plan
                  </button>
                  <button type="button" onClick={handleDeletePlan} disabled={isDeleting} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-black text-white hover:bg-red-400 disabled:opacity-60">
                    {isDeleting ? "Deleting..." : "Delete Plan"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddonDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#00BFFF]/35 bg-[#090909] text-white shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/5 p-5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  {editingAddon ? "Edit Add-On" : "Create Add-On"}
                </h3>
                <button type="button" onClick={() => setIsAddonDialogOpen(false)} className="rounded bg-white/5 p-1 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-5 pb-5">
                <div className="space-y-1.5">
                  <Label className="font-bold text-gray-400">Add-On Name</Label>
                  <Input
                    value={addonForm.name}
                    onChange={(event) => setAddonForm({ ...addonForm, name: event.target.value })}
                    placeholder="e.g. Personal Training"
                    className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-gray-400">Description</Label>
                  <Textarea
                    value={addonForm.description}
                    onChange={(event) => setAddonForm({ ...addonForm, description: event.target.value })}
                    placeholder="Provide details about the add-on..."
                    className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-gray-400">Price (₹)</Label>
                  <Input
                    type="number"
                    value={addonForm.price}
                    onChange={(event) => setAddonForm({ ...addonForm, price: parseFloat(event.target.value || "0") })}
                    className="rounded-lg border-white/10 bg-white/[0.02] text-white focus-visible:ring-[#00BFFF]"
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 mt-4">
                  <div>
                    <p className="font-bold text-white text-sm">Active Status</p>
                    <p className="text-[10px] text-gray-500">Allow members to purchase this add-on</p>
                  </div>
                  <Switch checked={addonForm.isActive} onCheckedChange={(checked) => setAddonForm({ ...addonForm, isActive: checked })} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddonDialogOpen(false)} className="rounded-xl border border-white/5 px-4 py-2 text-sm text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSaveAddon} className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-5 py-2 text-sm font-black text-black">
                    Save Add-On
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
