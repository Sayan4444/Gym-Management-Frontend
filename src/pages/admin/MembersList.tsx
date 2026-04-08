import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Crown, Eye } from "lucide-react";
import { useUsers } from "@/hooks/useApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, MembershipPlan, Subscription } from "@/data/types";
import { UserDetailsDialog } from "@/components/UserDetailsDialog";
import { PaginationFooter } from "@/components/PaginationFooter";
import { formatDate } from "@/lib/utils";

export default function MembersList() {
  const navigate = useNavigate();
  const members = useUsers({ include: "subscription,workoutPlan" }).data?.users || [];
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: MembershipPlan; subscription: Subscription } | null>(null);

  const itemsPerPage = 10;

  const filtered = members.filter((m: any) => {
    const sub = m.subscription;
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || sub?.status === filterStatus || (!sub && filterStatus === "none");
    if (!matchesSearch || !matchesFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedMembers = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Members</h1>
          <p className="text-muted-foreground">{members.length} total members</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
                <SelectItem value="none">No Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((m: any) => {
                  const sub = m.subscription;
                  const plan = sub?.plan;
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">{m.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            {plan?.name?.toLowerCase().includes("premium") && m.role !== "trainer" && (
                              <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-400 drop-shadow" />
                            )}
                          </div>
                          <span className="font-medium cursor-pointer hover:underline text-primary" onClick={() => setSelectedUser(m as User)}>{m.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.phone}</TableCell>
                      <TableCell>
                        {m.role === "trainer" ? "—" : (sub?.status === "Expired" ? <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 cursor-pointer hover:bg-destructive/20" onClick={() => { if (sub && plan) setSelectedPlan({plan, subscription: sub as Subscription}) }}>Expired</Badge> : (plan?.name ? <span className="cursor-pointer hover:underline text-primary" onClick={() => { if (sub && plan) setSelectedPlan({plan, subscription: sub as Subscription}) }}>{plan.name}</span> : "—"))}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{m.role || "member"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(m as User)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <PaginationFooter
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            itemName="users"
          />
        </CardContent>
      </Card>

      <UserDetailsDialog 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Plan & Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedPlan?.plan && selectedPlan?.subscription && (
            <div className="space-y-3 pt-4 text-sm">
              <div className="font-medium text-base mb-2">Plan Details</div>
              <div className="grid grid-cols-3 border-b pb-2"><span className="text-muted-foreground text-right mr-4">Name:</span> <span className="col-span-2 font-medium">{selectedPlan.plan.name}</span></div>
              <div className="grid grid-cols-3 border-b pb-2"><span className="text-muted-foreground text-right mr-4">Price:</span> <span className="col-span-2">₹{selectedPlan.plan.price}</span></div>
              <div className="grid grid-cols-3 pb-2"><span className="text-muted-foreground text-right mr-4">Duration:</span> <span className="col-span-2">{selectedPlan.plan.durationMonths} months</span></div>
              
              <div className="font-medium text-base mt-6 mb-2 border-t pt-4">Subscription Details</div>
              <div className="grid grid-cols-3 border-b pb-2"><span className="text-muted-foreground text-right mr-4">Status:</span> <span className="col-span-2"><Badge variant="outline">{selectedPlan.subscription.status}</Badge></span></div>
              <div className="grid grid-cols-3 border-b pb-2"><span className="text-muted-foreground text-right mr-4">Started On:</span> <span className="col-span-2">{formatDate(selectedPlan.subscription.startDate)}</span></div>
              <div className="grid grid-cols-3 pb-2"><span className="text-muted-foreground text-right mr-4">Ends On:</span> <span className="col-span-2">{formatDate(selectedPlan.subscription.endDate)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
