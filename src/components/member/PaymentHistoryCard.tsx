import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationFooter } from "@/components/PaginationFooter";
import { formatDate } from "@/lib/utils";
import type { Payment, MembershipPlan, Addon } from "@/data/types";

const PAYMENTS_PER_PAGE = 8;

function statusBadge(status: string) {
  const cls: Record<string, string> = {
    Active: "bg-success/10 text-success",
    Expired: "bg-destructive/10 text-destructive",
    Frozen: "bg-warning/10 text-warning",
    Paid: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Failed: "bg-destructive/10 text-destructive",
  };
  return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
}

interface PaymentHistoryCardProps {
  payments: Payment[];
  page: number;
  setPage: (page: number) => void;
  gymPlans: MembershipPlan[];
  gymAddons: Addon[];
}

export function PaymentHistoryCard({ payments, page, setPage, gymPlans, gymAddons }: PaymentHistoryCardProps) {
  const totalPages = Math.ceil(payments.length / PAYMENTS_PER_PAGE);
  const pagedPayments = payments.slice(
    (page - 1) * PAYMENTS_PER_PAGE,
    page * PAYMENTS_PER_PAGE,
  );

  return (
    <Card>
      <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment For</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedPayments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{formatDate(p.createdAt)}</TableCell>
                <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                <TableCell>{p.paymentFor}</TableCell>
                <TableCell>
                  {p.planId ? gymPlans.find(plan => plan.id === p.planId)?.name 
                    : (p.addonId ? gymAddons.find(addon => addon.id === p.addonId)?.name : "-")}
                </TableCell>
                <TableCell>{statusBadge(p.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationFooter
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          itemsPerPage={PAYMENTS_PER_PAGE}
          totalItems={payments.length}
          itemName="payments"
        />
      </CardContent>
    </Card>
  );
}
