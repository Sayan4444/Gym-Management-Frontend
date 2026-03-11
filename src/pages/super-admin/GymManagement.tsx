import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { gyms, users, payments, subscriptions } from "@/data/dummy";
import { Building2 } from "lucide-react";

export default function GymManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Gym Management</h1>
        <p className="text-muted-foreground">{gyms.length} gyms registered</p>
      </div>

      <div className="grid gap-4">
        {gyms.map((g) => {
          const members = users.filter(u => u.gymId === g.id && u.role === "Member").length;
          const trainers = users.filter(u => u.gymId === g.id && u.role === "Trainer").length;
          const revenue = payments.filter(p => p.status === "Paid" && users.find(u => u.id === p.userId)?.gymId === g.id).reduce((s, p) => s + p.amount, 0);
          const activeSubs = subscriptions.filter(s => s.status === "Active" && users.find(u => u.id === s.userId)?.gymId === g.id).length;

          return (
            <Card key={g.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{g.name}</h3>
                      <p className="text-sm text-muted-foreground">{g.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-center">
                    <div><p className="text-xl font-bold font-display">{members}</p><p className="text-xs text-muted-foreground">Members</p></div>
                    <div><p className="text-xl font-bold font-display">{trainers}</p><p className="text-xs text-muted-foreground">Trainers</p></div>
                    <div><p className="text-xl font-bold font-display">{activeSubs}</p><p className="text-xs text-muted-foreground">Active Subs</p></div>
                    <div><p className="text-xl font-bold font-display text-success">${revenue.toFixed(0)}</p><p className="text-xs text-muted-foreground">Revenue</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
