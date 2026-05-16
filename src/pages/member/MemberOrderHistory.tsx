import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayments, useMe, useMembershipPlansByGym, useAddons } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";
import { PaginationFooter } from "@/components/PaginationFooter";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function MemberOrderHistory() {
  const { data, isLoading: isPaymentsLoading } = usePayments();
  const payments = data?.payments || [];

  const { data: me, isLoading: isAuthLoading } = useMe();
  const gymPlans = useMembershipPlansByGym(me?.gymId)?.data?.memberships || [];
  const gymAddons = useAddons(me?.gymId)?.data?.addons || [];

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const pagedPayments = payments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isPaymentsLoading || isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Order History</h1>
        <p className="text-muted-foreground">{payments.length} total orders</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment For</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedPayments.map((p) => {
                return (
                  <TableRow key={p.id}>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                    <TableCell>₹{p.amount.toFixed(2)}</TableCell>
                    <TableCell>{p.paymentFor}</TableCell>
                    <TableCell>
                      {p.planId ? gymPlans.find(plan => plan.id === p.planId)?.name 
                        : (p.addonId ? gymAddons.find(addon => addon.id === p.addonId)?.name : "-")}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={p.status === "Paid" ? "default" : p.status === "Failed" ? "destructive" : "secondary"}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          )}

          {payments.length > 0 && (
            <PaginationFooter
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={payments.length}
              itemName="orders"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
