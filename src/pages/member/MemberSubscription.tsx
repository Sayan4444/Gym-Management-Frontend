import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PackagePlus, RotateCcw } from "lucide-react";
import { useSubscriptions, useMembershipPlans, useAddons } from "@/hooks/useApi";

export default function MemberSubscription() {
  const storedUser = localStorage.getItem("user");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const gymId = authUser?.gymId || 1;
  const userId = authUser?.id || 7;

  const { data: subscriptions = [] } = useSubscriptions(gymId);
  const { data: plans = [] } = useMembershipPlans(gymId);
  const { data: addons = [] } = useAddons(gymId);

  const sub = subscriptions.find((s) => s.userId === userId && s.status === "Active");
  const plan = sub ? plans.find((p) => p.id === sub.planId) : null;
  const memberPayments = [
    { id: 1, amount: 49.99, paymentDate: "2023-11-01", status: "Paid" }
  ];
  
  const gymPlans = plans.filter((p) => p.isActive);
  const gymAddons = addons.filter((a) => a.isActive);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showAddonDialog, setShowAddonDialog] = useState(false);

  const statusBadge = (status: string) => {
    const cls: Record<string, string> = { Active: "bg-success/10 text-success", Expired: "bg-destructive/10 text-destructive", Frozen: "bg-warning/10 text-warning", Paid: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning", Failed: "bg-destructive/10 text-destructive" };
    return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Subscription</h1>
        <p className="text-muted-foreground">Manage your membership</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
        <CardContent>
          {sub && plan ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Plan", plan.name], ["Price", `$${plan.price}/mo`], ["Status", null],
                ["Start Date", sub.startDate], ["End Date", sub.endDate], ["Duration", `${plan.durationMonths} month(s)`],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {label === "Status" ? statusBadge(sub.status) : <p className="font-medium">{value}</p>}
                </div>
              ))}
              <div className="col-span-2 mt-2 flex gap-3">
                <Button onClick={() => setShowRenewDialog(true)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Renew Subscription
                </Button>
                <Button variant="outline" onClick={() => setShowAddonDialog(true)}>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Add Addon
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">You don't have an active subscription. Choose a plan or add-on below to get started.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h3 className="font-semibold mb-3">Available Plans</h3>
                  <div className="space-y-3">
                    {gymPlans.length > 0 ? (
                      gymPlans.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">${p.price.toFixed(2)}</span>
                            <Button size="sm">Subscribe</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No plans available.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Available Addons</h3>
                  <div className="space-y-3">
                    {gymAddons.length > 0 ? (
                      gymAddons.map((a) => (
                        <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                          <p className="font-medium">{a.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">${a.price.toFixed(2)}</span>
                            <Button size="sm">Buy Addon</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No addons available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.paymentDate}</TableCell>
                  <TableCell>${p.amount.toFixed(2)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Renew Subscription Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Renew Subscription</DialogTitle>
            <DialogDescription>Choose a plan to subscribe to</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {gymPlans.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">${p.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => setShowRenewDialog(false)}>Buy Now</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Addon Dialog */}
      <Dialog open={showAddonDialog} onOpenChange={setShowAddonDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Addon</DialogTitle>
            <DialogDescription>Choose an add-on to purchase</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {gymAddons.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                <p className="font-medium">{a.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">${a.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => setShowAddonDialog(false)}>Buy Now</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
