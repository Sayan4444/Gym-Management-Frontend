import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Crown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUsers, useSubscriptions, useMembershipPlans } from "@/hooks/useApi";
import { log } from "node:console";

const statusBadge = (status?: string) => {
  if (!status) return <Badge variant="outline">No Plan</Badge>;
  const variants: Record<string, string> = {
    Active: "bg-success/10 text-success border-success/20",
    Expired: "bg-destructive/10 text-destructive border-destructive/20",
    Frozen: "bg-warning/10 text-warning border-warning/20",
  };
  return <Badge variant="outline" className={variants[status] || ""}>{status}</Badge>;
};

export default function MembersList() {
  const navigate = useNavigate();
  const members = useUsers().data?.users || [];
  const subscriptions = useSubscriptions().data?.subscriptions || [];
  const plans = useMembershipPlans().data?.memberships || [];


  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const getSubscriptionByUser = (userId: number) => subscriptions.find((s) => s.userId === userId && s.status === "Active");
  const getPlanById = (planId: number) => plans.find((p) => p.id === planId);

  const filtered = members.filter((m) => {
    const sub = getSubscriptionByUser(m.id);
    const plan = sub ? getPlanById(sub.planId) : null;
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || sub?.status === filterStatus || (!sub && filterStatus === "none");
    if (!matchesSearch || !matchesFilter) return false;
    if (premiumOnly && !plan?.name.toLowerCase().includes("premium")) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Members</h1>
          <p className="text-muted-foreground">{members.length} total members</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
            <div className="flex items-center gap-2">
              <Checkbox id="premium-filter-admin" checked={premiumOnly} onCheckedChange={(checked) => setPremiumOnly(checked === true)} />
              <Label htmlFor="premium-filter-admin" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" /> Premium only
              </Label>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Biometric</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const sub = getSubscriptionByUser(m.id);
                const plan = sub ? getPlanById(sub.planId) : null;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{m.name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          {plan?.name.toLowerCase().includes("premium") && (
                            <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-400 drop-shadow" />
                          )}
                        </div>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.email}</TableCell>
                    <TableCell className="text-muted-foreground">{m.phone}</TableCell>
                    <TableCell>{plan?.name || "—"}</TableCell>
                    <TableCell>{statusBadge(sub?.status)}</TableCell>
                    <TableCell>
                      {m.biometricId ? <Badge variant="secondary" className="text-xs">Enrolled</Badge> : <Badge variant="outline" className="text-xs">Not Set</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/members/${m.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
