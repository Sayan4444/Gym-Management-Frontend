import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubscriptionByUser, getPlanById, getPaymentsByUser } from "@/data/dummy";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sub = getSubscriptionByUser(7);
const plan = sub ? getPlanById(sub.planId) : null;
const memberPayments = getPaymentsByUser(7);

export default function MemberSubscription() {
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
              <div className="col-span-2 mt-2">
                <Button>Renew Subscription</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No active subscription.</p>
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
    </div>
  );
}
