import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGyms, useUsers, useSuperAdminDashboardStats } from "@/hooks/useApi";
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSearchParams } from "react-router-dom";
import GymManagement from "./GymManagement";
import SuperAdminUsers from "./SuperAdminUsers";

export default function SuperAdminDashboard() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const { data: gyms = [] } = useGyms();
  const { data: users = [] } = useUsers();
  const { data: stats } = useSuperAdminDashboardStats();

  const totalMembers = stats?.total_members ?? 0;
  const totalTrainers = users.filter((u) => u.role === "Trainer").length;
  const totalRevenue = stats?.total_revenue ?? 0;
  const activeSubscriptions = stats?.active_memberships ?? 0;

  const gymStats = gyms.map((g) => ({
    name: g.name,
    members: users.filter((u) => u.gymId === g.id && u.role === "Member").length,
  }));

  const kpis = [
    { title: "Total Gyms", value: gyms.length, icon: Building2, color: "text-primary" },
    { title: "Total Members", value: totalMembers, icon: Users, color: "text-success" },
    { title: "Active Subs", value: activeSubscriptions, icon: TrendingUp, color: "text-primary" },
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: CreditCard, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all gyms</p>
      </div>

      {currentTab === "overview" && (
        <div className="space-y-6">
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
        </div>
      )}

      {currentTab === "gyms" && <GymManagement />}
      {currentTab === "users" && <SuperAdminUsers />}
    </div>
  );
}
