import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PackagePlus, RotateCcw, Loader2 } from "lucide-react";
import { useAddons, useMe, useMembershipPlansByGym } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";
import { PaginationFooter } from "@/components/PaginationFooter";

const PAYMENTS_PER_PAGE = 8;

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe("include=gym,subscription,workout_plan,payments");

  const sub = me?.subscription;
  const plan = me?.subscription?.plan;
  const userAddons = me?.userAddon || [] ;
  const memberPayments = me?.payments || [] ;

  const gymPlans = useMembershipPlansByGym(me?.gymId)?.data?.memberships || []
  const gymAddons = useAddons(me?.gymId)?.data?.addons || []

  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);

  const totalPaymentPages = Math.ceil(memberPayments.length / PAYMENTS_PER_PAGE);
  const pagedPayments = memberPayments.slice((paymentPage - 1) * PAYMENTS_PER_PAGE, paymentPage * PAYMENTS_PER_PAGE);

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }


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
                ["Start Date", formatDate(sub.startDate)], ["End Date", formatDate(sub.endDate)], ["Duration", `${plan.durationMonths} month(s)`],
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
                    {plan ? (
                        <div key={plan.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan.durationMonths} month{plan.durationMonths > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">${plan.price.toFixed(2)}</span>
                            <Button size="sm">Subscribe</Button>
                          </div>
                        </div>
                      ) : (
                      <p className="text-sm text-muted-foreground">No plans available.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Available Addons</h3>
                  <div className="space-y-3">
                      {userAddons.length > 0 ? (
                        userAddons.map((a) => (
                        <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                          <p className="font-medium">{a.addon.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">${a.addon.price.toFixed(2)}</span>
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
              {pagedPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatDate(p.createdAt)}</TableCell>
                  <TableCell>${p.amount.toFixed(2)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationFooter
            page={paymentPage}
            totalPages={totalPaymentPages}
            setPage={setPaymentPage}
            itemsPerPage={PAYMENTS_PER_PAGE}
            totalItems={memberPayments.length}
            itemName="payments"
          />
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
