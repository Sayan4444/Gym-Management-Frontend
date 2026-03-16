import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Crown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUsers, useGyms, useSubscriptions, usePlans } from "@/hooks/useApi";

export default function SuperAdminUsers() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const { data: users = [] } = useUsers();
  const { data: gyms = [] } = useGyms();
  const { data: subscriptions = [] } = useSubscriptions();
  const { data: plans = [] } = usePlans();

  const getGymById = (gymId: number) => gyms.find((g) => g.id === gymId);
  const getSubscriptionByUser = (userId: number) => subscriptions.find((s) => s.userId === userId && s.status === "Active");
  const getPlanById = (planId: number) => plans.find((p) => p.id === planId);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    if (!matchesSearch || !matchesRole) return false;
    if (premiumOnly && filterRole === "Member") {
      const sub = getSubscriptionByUser(u.id);
      const plan = sub ? getPlanById(sub.planId) : null;
      if (!plan?.name.toLowerCase().includes("premium")) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">All Users</h1>
        <p className="text-muted-foreground">{users.length} total users</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterRole} onValueChange={(v) => { setFilterRole(v); if (v !== "Member") setPremiumOnly(false); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                <SelectItem value="GymAdmin">Gym Admin</SelectItem>
                <SelectItem value="Trainer">Trainer</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
            {filterRole === "Member" && (
              <div className="flex items-center gap-2">
                <Checkbox id="premium-filter" checked={premiumOnly} onCheckedChange={(checked) => setPremiumOnly(checked === true)} />
                <Label htmlFor="premium-filter" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                  <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" /> Premium only
                </Label>
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Gym</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const gym = u.gymId ? getGymById(u.gymId) : null;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          {u.role === "Member" && (() => {
                            const sub = getSubscriptionByUser(u.id);
                            const plan = sub ? getPlanById(sub.planId) : null;
                            return plan?.name.toLowerCase().includes("premium") ? (
                              <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-400 drop-shadow" />
                            ) : null;
                          })()}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{gym?.name || "—"}</TableCell>
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
