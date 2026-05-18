import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationFooter } from "@/components/PaginationFooter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Package, X, SmilePlus } from "lucide-react";
import {
  useMembershipPlans, useAddons, useMe,
  useCreateMembershipPlan, useUpdateMembershipPlan, useDeleteMembershipPlan,
  useAddPlanAddon, useUpdatePlanAddon, useRemovePlanAddon,
} from "@/hooks/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { useToast } from "@/hooks/use-toast";
import { MembershipPlan, Addon, PlanAddon } from "@/data/types";

// A local copy of a plan addon — may be "new" (not yet persisted) if _isNew is true.
// frequency is overridden to string here so the text input works naturally;
// it is parsed back to a number before any API call.
type LocalPlanAddon = Omit<PlanAddon, "frequency"> & { frequency: string; _isNew?: boolean };

export default function MembershipPlansPage() {
  const { data: user } = useMe();
  const gymId = user?.gymId as number;

  const plans = [...(useMembershipPlans().data?.memberships || [])].sort((a, b) => a.id - b.id);
  const [plansPage, setPlansPage] = useState(1);
  const itemsPerPage = 10;
  const totalPlansPages = Math.ceil(plans.length / itemsPerPage) || 1;
  const paginatedPlans = plans.slice((plansPage - 1) * itemsPerPage, plansPage * itemsPerPage);

  const addons = [...(useAddons().data?.addons || [])].sort((a, b) => a.id - b.id);
  const { toast } = useToast();

  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();

  const addPlanAddon = useAddPlanAddon();
  const updatePlanAddon = useUpdatePlanAddon();
  const removePlanAddon = useRemovePlanAddon();

  // --------------- Plan Dialog State ---------------
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planForm, setPlanForm] = useState<{ name: string; price: number; durationMonths: number; isActive: boolean; planIcon: string | null }>({ name: "", price: 0, durationMonths: 1, isActive: true, planIcon: null });

  // Local (unsaved) plan-addon list shown inside the dialog
  const [localPlanAddons, setLocalPlanAddons] = useState<LocalPlanAddon[]>([]);

  // Fields for the "add a new addon" row at the bottom of the list
  const [newPlanAddonId, setNewPlanAddonId] = useState<string>("");
  const [newPlanAddonFrequency, setNewPlanAddonFrequency] = useState<string>("");

  // ===== Plan dialog open/close =====

  const handleOpenPlanDialog = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({ name: plan.name, price: plan.price, durationMonths: plan.durationMonths, isActive: plan.isActive, planIcon: plan.planIcon ?? null });
      // Seed local list from the latest server data for this plan.
      // Convert frequency (number from API) to string for the text inputs.
      const latest = plans.find((p) => p.id === plan.id) ?? plan;
      setLocalPlanAddons(
        latest.planAddons
          ? latest.planAddons.map((pa) => ({ ...pa, frequency: String(pa.frequency) }))
          : []
      );
    } else {
      setEditingPlan(null);
      setPlanForm({ name: "", price: 0, durationMonths: 1, isActive: true, planIcon: null });
      setLocalPlanAddons([]);
    }
    setNewPlanAddonId("");
    setNewPlanAddonFrequency("");
    setIsPlanDialogOpen(true);
  };

  // ===== Local plan-addon list mutations (no API calls) =====

  const handleLocalAddPlanAddon = () => {
    const freq = parseInt(newPlanAddonFrequency, 10);
    if (!newPlanAddonId || !newPlanAddonFrequency.trim() || isNaN(freq) || freq <= 0) return;
    const addonId = parseInt(newPlanAddonId);
    const addon = addons.find((a) => a.id === addonId);
    setLocalPlanAddons((prev) => [
      ...prev,
      {
        id: -Date.now(), // temporary negative id — marks as new/unsaved
        createdAt: "",
        updatedAt: "",
        planId: editingPlan?.id ?? 0,
        addonId,
        frequency: newPlanAddonFrequency.trim(),
        addon,
        _isNew: true,
      },
    ]);
    setNewPlanAddonId("");
    setNewPlanAddonFrequency("");
  };

  const handleLocalRemovePlanAddon = (localId: number) => {
    setLocalPlanAddons((prev) => prev.filter((pa) => pa.id !== localId));
  };

  const handleLocalUpdateFrequency = (localId: number, frequency: string) => {
    setLocalPlanAddons((prev) =>
      prev.map((pa) => (pa.id === localId ? { ...pa, frequency } : pa))
    );
  };

  // ===== Save plan (makes ALL API calls here) =====

  const handleSavePlan = async () => {
    if (!gymId) return;

    try {
      let savedPlanId: number | undefined;

      if (editingPlan) {
        await updatePlan.mutateAsync({
          gymId,
          membershipId: editingPlan.id,
          data: { ...planForm },
        });
        savedPlanId = editingPlan.id;
      } else {
        const created = await createPlan.mutateAsync({
          gymId,
          data: planForm as MembershipPlan,
        });
        savedPlanId = (created as MembershipPlan).id;
      }

      // Process plan-addon changes only if we were editing an existing plan
      // (new plans have no addons yet — user can edit after creation to add them)
      if (editingPlan && savedPlanId) {
        const original = (plans.find((p) => p.id === editingPlan.id)?.planAddons ?? []) as PlanAddon[];
        const originalMap = new Map(original.map((pa) => [pa.id, pa]));

        const newItems = localPlanAddons.filter((pa) => pa._isNew);
        const localPersistedIds = new Set(localPlanAddons.filter((pa) => !pa._isNew).map((pa) => pa.id));
        const removedItems = original.filter((pa) => !localPersistedIds.has(pa.id));
        const updatedItems = localPlanAddons.filter(
          (pa) => !pa._isNew && originalMap.get(pa.id)?.frequency !== parseInt(pa.frequency, 10)
        );

        await Promise.all([
          ...newItems.map((pa) =>
            addPlanAddon.mutateAsync({ gymId, membershipId: savedPlanId!, addonId: pa.addonId, frequency: parseInt(pa.frequency, 10) })
          ),
          ...removedItems.map((pa) =>
            removePlanAddon.mutateAsync({ gymId, membershipId: savedPlanId!, planAddonId: pa.id })
          ),
          ...updatedItems.map((pa) =>
            updatePlanAddon.mutateAsync({ gymId, membershipId: savedPlanId!, planAddonId: pa.id, frequency: parseInt(pa.frequency, 10) })
          ),
        ]);
      }

      toast({ title: editingPlan ? "Plan updated successfully" : "Plan created successfully" });
      setIsPlanDialogOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Error saving plan", description: msg, variant: "destructive" });
    }
  };

  // ===== Plan table actions =====

  const handleDeletePlan = (id: number) => {
    if (!gymId || !confirm("Are you sure you want to delete this plan?")) return;
    deletePlan.mutate(
      { gymId, membershipId: id },
      {
        onSuccess: () => toast({ title: "Plan deleted successfully" }),
        onError: (error) => toast({ title: "Error deleting plan", description: error.message, variant: "destructive" }),
      }
    );
  };

  const handleTogglePlan = (plan: MembershipPlan, checked: boolean) => {
    if (!gymId) return;
    updatePlan.mutate(
      { gymId, membershipId: plan.id, data: { isActive: checked } },
      {
        onSuccess: () => toast({ title: `Plan ${checked ? "activated" : "deactivated"}` }),
        onError: (error) => toast({ title: "Error updating plan", description: error.message, variant: "destructive" }),
      }
    );
  };

  // Addons not yet in the local plan-addon list (to populate the picker)
  const attachedAddonIds = new Set(localPlanAddons.map((pa) => pa.addonId));
  const availableAddons = addons.filter((a) => a.isActive && !attachedAddonIds.has(a.id));

  const isSaving = createPlan.isPending || updatePlan.isPending ||
    addPlanAddon.isPending || removePlanAddon.isPending || updatePlanAddon.isPending;

  return (
    <div className="space-y-6">
      {/* Plans Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Membership Plans</h1>
          <p className="text-muted-foreground">{plans.length} plans configured</p>
        </div>
        <Button onClick={() => handleOpenPlanDialog()}><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Icon</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Included Add-Ons</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.planIcon ? (
                      <span className="text-2xl">{p.planIcon}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {p.name}
                  </TableCell>
                  <TableCell>₹{p.price.toFixed(2)}</TableCell>
                  <TableCell>{p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}</TableCell>
                  <TableCell>
                    {p.planAddons && p.planAddons.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.planAddons.map((pa) => (
                          <Badge key={pa.id} variant="secondary" className="text-xs">
                            {pa.addon?.name ?? `Addon #${pa.addonId}`}
                            <span className="ml-1 text-muted-foreground opacity-70">· {pa.frequency}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "default" : "outline"} className={p.isActive ? "bg-success/10 text-success border-success/20" : ""}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={p.isActive} onCheckedChange={(c) => handleTogglePlan(p, c)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenPlanDialog(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationFooter
            page={plansPage}
            totalPages={totalPlansPages}
            setPage={setPlansPage}
            itemsPerPage={itemsPerPage}
            totalItems={plans.length}
            itemName="plans"
          />
        </CardContent>
      </Card>

      {/* Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Basic plan fields */}
            <div className="flex gap-4 items-end">
              <div className="grid gap-2 shrink-0">
                <Label>Icon</Label>
                <div className="flex items-center gap-2">
                  <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10 w-12 p-0 text-xl" title="Choose Emoji">
                        {planForm.planIcon || <SmilePlus className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-none" side="right" align="start">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setPlanForm({ ...planForm, planIcon: emojiData.emoji });
                          setIsEmojiPickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {planForm.planIcon && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setPlanForm({ ...planForm, planIcon: null })}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid gap-2 flex-1">
                <Label>Name</Label>
                <Input
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Duration (Months)</Label>
                <Input
                  type="number"
                  value={planForm.durationMonths}
                  onChange={(e) => setPlanForm({ ...planForm, durationMonths: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Included Add-Ons — only for existing plans */}
            {editingPlan && (
              <div className="grid gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Included Add-Ons</Label>
                </div>

                {/* Local plan-addon list */}
                {localPlanAddons.length > 0 ? (
                  <div className="space-y-2">
                    {localPlanAddons.map((pa) => (
                      <div
                        key={pa.id}
                        className={`flex items-center gap-2 p-2 rounded-md border ${pa._isNew ? "border-dashed border-primary/40 bg-primary/5" : "bg-muted/30"}`}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {pa.addon?.name ?? `Addon #${pa.addonId}`}
                          {pa._isNew && (
                            <span className="ml-2 text-xs text-primary font-normal">unsaved</span>
                          )}
                        </span>
                        <Input
                          type="number"
                          min={1}
                          className="h-7 w-32 text-xs"
                          placeholder="e.g. 12"
                          value={pa.frequency}
                          onChange={(e) => handleLocalUpdateFrequency(pa.id, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => handleLocalRemovePlanAddon(pa.id)}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No add-ons included in this plan yet.</p>
                )}

                {/* Add new addon row */}
                {availableAddons.length > 0 && (
                  <div className="flex items-end gap-2 pt-1">
                    <div className="flex-1 grid gap-1">
                      <Label className="text-xs text-muted-foreground">Add-On</Label>
                      <Select value={newPlanAddonId} onValueChange={setNewPlanAddonId}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select add-on…" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAddons.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                              {a.name} — ₹{a.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32 grid gap-1">
                      <Label className="text-xs text-muted-foreground">Count</Label>
                      <Input
                        type="number"
                        min={1}
                        className="h-9"
                        placeholder="1"
                        value={newPlanAddonFrequency}
                        onChange={(e) => setNewPlanAddonFrequency(e.target.value)}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="h-9"
                      disabled={!newPlanAddonId || !newPlanAddonFrequency.trim() || parseInt(newPlanAddonFrequency, 10) <= 0 || isNaN(parseInt(newPlanAddonFrequency, 10))}
                      onClick={handleLocalAddPlanAddon}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                )}

                {availableAddons.length === 0 && addons.filter((a) => a.isActive).length > 0 && (
                  <p className="text-xs text-muted-foreground">All active add-ons are already included in this plan.</p>
                )}
                {addons.filter((a) => a.isActive).length === 0 && (
                  <p className="text-xs text-muted-foreground">No active add-ons available. Create some in the Add-Ons section below.</p>
                )}
              </div>
            )}

            {!editingPlan && (
              <p className="text-xs text-muted-foreground">
                <Package className="inline h-3 w-3 mr-1" />
                After creating the plan, edit it to include add-ons with their time counts.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
