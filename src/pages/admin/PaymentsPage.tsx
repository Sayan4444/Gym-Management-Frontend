import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { usePayments } from "@/hooks/useApi";
import { PaginationFooter } from "@/components/PaginationFooter";

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data } = usePayments({
    status: filterStatus === "all" ? undefined : filterStatus,
    search: search || undefined,
  });

  const filtered = data?.payments || [];
  const totalPaid = filtered.filter((p: any) => p.status === "Paid").reduce((s: any, p: any) => s + p.amount, 0);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedPayments = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const statusBadge = (status: string) => {
    const cls: Record<string, string> = {
      Paid: "bg-success/10 text-success border-success/20",
      Pending: "bg-warning/10 text-warning border-warning/20",
      Failed: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Payments</h1>
        <p className="text-muted-foreground">Total collected: ${totalPaid.toFixed(2)}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by member..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment For</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((p: any) => {
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.userName || "Unknown"}</TableCell>
                    <TableCell>${p.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={p.paymentFor === "Membership Plan" ? "bg-primary/10 text-primary border-primary/20" : "bg-purple-500/10 text-purple-600 border-purple-500/20"}>
                        {p.paymentFor}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.paymentDate}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <PaginationFooter
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            itemName="payments"
          />
        </CardContent>
      </Card>
    </div>
  );
}
