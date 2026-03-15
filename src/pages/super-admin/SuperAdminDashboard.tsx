import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gyms, users, payments, subscriptions } from "@/data/dummy";
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GymManagement from "./GymManagement";
import SuperAdminUsers from "./SuperAdminUsers";

const totalMembers = users.filter((u) => u.role === "Member").length;
const totalTrainers = users.filter((u) => u.role === "Trainer").length;
const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
const activeSubscriptions = subscriptions.filter((s) => s.status === "Active").length;

const gymStats = gyms.map((g) => ({
  name: g.name,
  members: users.filter((u) => u.gymId === g.id && u.role === "Member").length,
  revenue: payments
    .filter((p) => p.status === "Paid" && users.find((u) => u.id === p.userId)?.gymId === g.id)
    .reduce((s, p) => s + p.amount, 0),
}));

const kpis = [
  { title: "Total Gyms", value: gyms.length, icon: Building2, color: "text-primary" },
  { title: "Total Members", value: totalMembers, icon: Users, color: "text-success" },
  { title: "Active Subs", value: activeSubscriptions, icon: TrendingUp, color: "text-primary" },
  { title: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: CreditCard, color: "text-success" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all gyms</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gyms">Gyms</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <Card key={k.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{k.title}</p>
                      <p className="text-2xl font-bold font-display mt-1">{k.value}</p>
                    </div>
                    <k.icon className={`h-8 w-8 ${k.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Members by Gym</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gymStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="members" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gyms">
          <GymManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <SuperAdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
