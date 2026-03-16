import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useDashboardStats, useSubscriptions } from "@/hooks/useApi";

// Static mock data for charts since backend aggregation isn't implemented
const weekData = [
  { day: "Mon", count: 45 }, { day: "Tue", count: 52 }, { day: "Wed", count: 38 },
  { day: "Thu", count: 65 }, { day: "Fri", count: 48 }, { day: "Sat", count: 25 }, { day: "Sun", count: 18 }
];
const monthlyRevenue = [
  { month: "Jan", revenue: 1049.95 },
  { month: "Feb", revenue: 689.96 },
  { month: "Mar", revenue: 149.97 },
];

const statusColors = { Active: "hsl(142, 71%, 45%)", Expired: "hsl(0, 84%, 60%)", Frozen: "hsl(38, 92%, 50%)" };

export default function AdminDashboard() {
  const gymId = 1;
  const { data: stats } = useDashboardStats(gymId);
  const { data: subscriptions = [] } = useSubscriptions(gymId);

  const activeSubs = subscriptions.filter(s => s.status === "Active");
  const expiringSubs = subscriptions.filter(s => {
    if (s.status !== "Active") return false;
    const diff = (new Date(s.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff > 0;
  });

  const subStatusData = [
    { name: "Active", value: activeSubs.length },
    { name: "Expired", value: subscriptions.filter(s => s.status === "Expired").length },
    { name: "Frozen", value: subscriptions.filter(s => s.status === "Frozen").length },
  ];

  const kpiCards = [
    { title: "Total Members", value: stats?.total_members ?? 0, icon: Users, color: "text-primary" },
    { title: "Today's Attendance", value: stats?.todays_attendance ?? 0, icon: CalendarCheck, color: "text-success" },
    { title: "Active Memberships", value: stats?.active_memberships ?? 0, icon: TrendingUp, color: "text-primary" },
    { title: "Expiring Soon", value: expiringSubs.length, icon: AlertTriangle, color: "text-warning" },
    { title: "Total Revenue", value: `$${stats?.total_revenue?.toFixed(2) ?? "0"}`, icon: CreditCard, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Sarah. Here's your gym overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold font-display mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} formatter={(v: number) => [`$${v}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={subStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {subStatusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name as keyof typeof statusColors]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
