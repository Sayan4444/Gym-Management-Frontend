import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationFooter } from "@/components/PaginationFooter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAddons, useMe,
  useCreateAddon, useUpdateAddon, useDeleteAddon,
} from "@/hooks/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Addon } from "@/data/types";

export default function AddonsPage() {
  const { data: user } = useMe();
  const gymId = user?.gymId as number;

  const addons = [...(useAddons().data?.addons || [])].sort((a, b) => a.id - b.id);
  const [addonsPage, setAddonsPage] = useState(1);
  const itemsPerPage = 5;
  const totalAddonsPages = Math.ceil(addons.length / itemsPerPage) || 1;
  const paginatedAddons = addons.slice((addonsPage - 1) * itemsPerPage, addonsPage * itemsPerPage);
  const { toast } = useToast();

  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();

  // --------------- Addon Dialog State ---------------
  const [isAddonDialogOpen, setIsAddonDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [addonForm, setAddonForm] = useState({ name: "", price: 0, isActive: true });

  // ===== Addon dialog =====

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
          onSuccess: () => { toast({ title: "Add-on updated successfully" }); setIsAddonDialogOpen(false); },
          onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
        }
      );
    } else {
      createAddon.mutate(
        { gymId, data: addonForm as Addon },
        {
          onSuccess: () => { toast({ title: "Add-on created successfully" }); setIsAddonDialogOpen(false); },
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
        onSuccess: () => toast({ title: `Add-on ${checked ? "activated" : "deactivated"}` }),
        onError: (error) => toast({ title: "Error updating add-on", description: error.message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Ons Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Add Ons</h1>
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
              {paginatedAddons.map((a) => (
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

          <PaginationFooter
            page={addonsPage}
            totalPages={totalAddonsPages}
            setPage={setAddonsPage}
            itemsPerPage={itemsPerPage}
            totalItems={addons.length}
            itemName="add-ons"
          />
        </CardContent>
      </Card>

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
              <Label>Price (₹)</Label>
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
