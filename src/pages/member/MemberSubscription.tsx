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
import { RazorpayButton } from "@/components/RazorpayButton";

const PAYMENTS_PER_PAGE = 8;

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe("include=gym,subscription,workout_plan,payments");

  const sub = me?.subscription;
  const plan = me?.subscription?.plan;
  const memberPayments = [...(me?.payments || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );


  const gymPlans = useMembershipPlansByGym(me?.gymId)?.data?.memberships || [];
  const gymAddons = useAddons(me?.gymId)?.data?.addons || [];

  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);

  const totalPaymentPages = Math.ceil(memberPayments.length / PAYMENTS_PER_PAGE);
  const pagedPayments = memberPayments.slice(
    (paymentPage - 1) * PAYMENTS_PER_PAGE,
    paymentPage * PAYMENTS_PER_PAGE,
  );

  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const cls: Record<string, string> = {
      Active: "bg-success/10 text-success",
      Expired: "bg-destructive/10 text-destructive",
      Frozen: "bg-warning/10 text-warning",
      Paid: "bg-success/10 text-success",
      Pending: "bg-warning/10 text-warning",
      Failed: "bg-destructive/10 text-destructive",
    };
    return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Subscription</h1>
        <p className="text-muted-foreground">Manage your membership</p>
      </div>

      {/* ── Current Plan ────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
        <CardContent>
          {sub ? (
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Plan", plan!.name],
                ["Price", `₹${plan!.price}/mo`],
                ["Status", null],
                ["Start Date", formatDate(sub.startDate)],
                ["End Date", formatDate(sub.endDate)],
                ["Duration", `${plan!.durationMonths} month(s)`],
              ] as [string, string | null][]).map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {label === "Status" ? statusBadge(sub.status) : <p className="font-medium">{value}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div>No current subscription</div>
          )}

          <div className="col-span-2 mt-4 flex gap-3">
            <Button onClick={() => setShowRenewDialog(true)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Renew Subscription
            </Button>
            <Button variant="outline" onClick={() => setShowAddonDialog(true)}>
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Addon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment History ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment For</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatDate(p.createdAt)}</TableCell>
                  <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                  <TableCell>{p.paymentFor}</TableCell>
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

      {/* ── Renew Subscription Dialog ───────────────────────────────────────── */}
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
                  <RazorpayButton
                    item={p}
                    type="Membership Plan"
                    prefill={prefill}
                    onSuccess={() => setShowRenewDialog(false)}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Addon Dialog ────────────────────────────────────────────────── */}
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
                  <RazorpayButton
                    item={a}
                    type="Add-On"
                    prefill={prefill}
                    onSuccess={() => setShowAddonDialog(false)}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
