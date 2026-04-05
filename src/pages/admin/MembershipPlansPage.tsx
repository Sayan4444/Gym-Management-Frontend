import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useMembershipPlans, useAddons, useMe, useCreateMembershipPlan, useUpdateMembershipPlan, useDeleteMembershipPlan, useCreateAddon, useUpdateAddon, useDeleteAddon } from "@/hooks/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MembershipPlan, Addon } from "@/data/types";

export default function MembershipPlansPage() {
  const { data: user } = useMe();
  const gymId = user?.gymId as number;

  const plans = [...(useMembershipPlans().data?.memberships || [])].sort((a, b) => a.id - b.id);
  // console.log(plans);

  const addons = [...(useAddons().data?.addons || [])].sort((a, b) => a.id - b.id);
  const { toast } = useToast();

  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();

  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();

  // Plan Dialog State
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [planForm, setPlanForm] = useState({ name: "", price: 0, durationMonths: 1, isActive: true });

  // Addon Dialog State
  const [isAddonDialogOpen, setIsAddonDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [addonForm, setAddonForm] = useState({ name: "", price: 0, isActive: true });

  const handleOpenPlanDialog = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({ name: plan.name, price: plan.price, durationMonths: plan.durationMonths, isActive: plan.isActive });
    } else {
      setEditingPlan(null);
      setPlanForm({ name: "", price: 0, durationMonths: 1, isActive: true });
    }
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!gymId) return;
    if (editingPlan) {
      updatePlan.mutate(
        { gymId, membershipId: editingPlan.id, data: { ...editingPlan, ...planForm } },
        {
          onSuccess: () => {
            toast({ title: "Plan updated successfully" });
            setIsPlanDialogOpen(false);
          },
          onError: (error) => toast({ title: "Error updating plan", description: error.message, variant: "destructive" }),
        }
      );
    } else {
      createPlan.mutate(
        { gymId, data: planForm as MembershipPlan },
        {
          onSuccess: () => {
            toast({ title: "Plan created successfully" });
            setIsPlanDialogOpen(false);
          },
          onError: (error) => toast({ title: "Error creating plan", description: error.message, variant: "destructive" }),
        }
      );
    }
  };

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
        onSuccess: () => toast({ title: `Plan ${checked ? 'activated' : 'deactivated'}` }),
        onError: (error) => toast({ title: "Error updating plan", description: error.message, variant: "destructive" }),
      }
    );
  };

  const handleOpenAddonDialog = (addon?: Addon) => {
    if (addon) {
      setEditingAddon(addon);
      setAddonForm({ name: addon.name, price: addon.price, isActive: addon.isActive });
    } else {
      setEditingAddon(null);
      setAddonForm({ name: "", price: 0, isActive: true });
    }
    setIsAddonDialogOpen(true);
  };

  const handleSaveAddon = () => {
    if (!gymId) return;
    if (editingAddon) {
      updateAddon.mutate(
        { gymId, addonId: editingAddon.id, data: { ...editingAddon, ...addonForm } },
        {
          onSuccess: () => {
            toast({ title: "Add-on updated successfully" });
            setIsAddonDialogOpen(false);
          },
          onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
        }
      );
    } else {
      createAddon.mutate(
        { gymId, data: addonForm as Addon },
        {
          onSuccess: () => {
            toast({ title: "Add-on created successfully" });
            setIsAddonDialogOpen(false);
          },
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
      { gymId, addonId: addon.id, data: { ...addon, isActive: checked } },
      {
        onSuccess: () => toast({ title: `Add-on ${checked ? 'activated' : 'deactivated'}` }),
        onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
      }
    );
  };

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
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>₹{p.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}
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
        </CardContent>
      </Card>

      {/* Add Ons Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Add Ons</h2>
          <p className="text-muted-foreground">Optional extras members can add to their plans</p>
        </div>
        <Button onClick={() => handleOpenAddonDialog()}><Plus className="mr-2 h-4 w-4" /> Add Add-On</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Add-On Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>₹{a.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={a.isActive ? "default" : "outline"} className={a.isActive ? "bg-success/10 text-success border-success/20" : ""}>
                      {a.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={a.isActive} onCheckedChange={(c) => handleToggleAddon(a, c)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenAddonDialog(a)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAddon(a.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePlan}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add-on Dialog */}
      <Dialog open={isAddonDialogOpen} onOpenChange={setIsAddonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddon ? "Edit Add-On" : "Create Add-On"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={addonForm.name}
                onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={addonForm.price}
                onChange={(e) => setAddonForm({ ...addonForm, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddonDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAddon}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
