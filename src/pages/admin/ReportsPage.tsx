import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceRecords, payments, getMembersByGym } from "@/data/dummy";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const gymMembers = getMembersByGym(1);
const memberIds = new Set(gymMembers.map(m => m.id));

// Attendance over last 30 days
const attendanceData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const dateStr = d.toISOString().split("T")[0];
  return {
    date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
    count: attendanceRecords.filter(a => a.date === dateStr && memberIds.has(a.userId)).length,
  };
});

// Revenue summary
const revenueData = [
  { month: "Jan '24", revenue: 1049.95, count: 5 },
  { month: "Feb '24", revenue: 689.96, count: 4 },
  { month: "Mar '25", revenue: 149.97, count: 3 },
];

const totalRevenue = payments.filter(p => p.status === "Paid" && memberIds.has(p.userId)).reduce((s, p) => s + p.amount, 0);
const avgDaily = (attendanceRecords.filter(a => memberIds.has(a.userId)).length / 30).toFixed(1);

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Reports</h1>
        <p className="text-muted-foreground">Revenue and attendance analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display text-success">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display text-primary">{avgDaily}</p>
            <p className="text-sm text-muted-foreground">Avg Daily Attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display">{gymMembers.length}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Attendance Trend (30 Days)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Revenue by Month</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
