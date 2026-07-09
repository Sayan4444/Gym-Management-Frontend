import { AlertCircle, ArrowUpRight, Award, CalendarCheck, CreditCard, UserCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminDashboardStats } from "@/hooks/useApi";

const statusColors: Record<string, string> = {
  Active: "#39FF14",
  Expired: "#f87171",
  Paused: "#fbbf24",
  Cancelled: "#ef4444",
  Upcoming: "#00BFFF",
};

const chartTooltipStyle = {
  backgroundColor: "#090909",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "white",
};

const revenueTooltipLabelStyle = { color: "#00BFFF", fontWeight: "bold", fontSize: "11px" };
const activeMembersTooltipLabelStyle = { color: "#39FF14", fontWeight: "bold", fontSize: "11px" };
const membershipStatusTooltipStyle = {
  backgroundColor: "rgba(15,23,42,0.96)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
  color: "#f8fafc",
  fontSize: "11px",
  lineHeight: 1,
  padding: "6px 8px",
};
const membershipStatusTooltipItemStyle = { color: "#f8fafc", fontWeight: 700, padding: 0 };
const membershipStatusTooltipLabelStyle = { color: "#94a3b8", fontWeight: 700, fontSize: "10px", marginBottom: 2 };

function formatPercent(value: number) {
  const rounded = Math.abs(value).toFixed(1).replace(/\.0$/, "");
  if (value > 0) return `+${rounded}%`;
  if (value < 0) return `-${rounded}%`;
  return "0%";
}

function TrendBadge({ value, title }: { value: number; title: string }) {
  const tone = value < 0 ? "bg-red-500/10 text-red-400" : value > 0 ? "bg-[#39FF14]/10 text-[#39FF14]" : "bg-white/10 text-gray-400";

  return (
    <span title={title} className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${tone}`}>
      {formatPercent(value)}
    </span>
  );
}

function DataUnavailable() {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
      <p className="font-mono text-xs uppercase tracking-wider text-gray-500">Data Not Available</p>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
      <p className="font-mono text-xs uppercase tracking-wider text-gray-500">Loading Dashboard</p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isError, isLoading } = useAdminDashboardStats();

  const monthlyRevenue = stats?.monthlyRevenue || [];
  const weeklyAttendance = stats?.weeklyAttendance || [];
  const activeMembersTrend = stats?.activeMembersTrend || [];
  const membershipStatus = (stats?.membershipStatus || []).filter((item) => item.value > 0);
  // Average check-ins across the returned weekly attendance window.
  const avgDailyAttendance =
    weeklyAttendance.length > 0
      ? (weeklyAttendance.reduce((total, day) => total + day.count, 0) / weeklyAttendance.length).toFixed(1)
      : "0.0";

  const kpiCards = stats
    ? [
        { title: "Total Members", value: stats.totalMembers, icon: Users, color: "text-[#00BFFF]", route: "/admin?tab=members" },
        {
          title: "Active Memberships",
          value: stats.activeMemberships,
          icon: Award,
          color: "text-[#39FF14]",
          route: "/admin?tab=plans",
          badge: <TrendBadge value={stats.activeMembershipChangePercent} title="Compared to last month" />,
        },
        {
          title: "Monthly Revenue",
          value: `₹${stats.currentMonthRevenue.toLocaleString("en-IN")}`,
          icon: CreditCard,
          color: "text-purple-400",
          highlight: true,
          route: "/admin?tab=payments",
        },
        {
          title: "Today's Attendance",
          value: stats.todaysAttendance,
          icon: UserCheck,
          color: "text-amber-400",
          route: "/admin?tab=attendance",
          badge: <TrendBadge value={stats.attendanceChangePercent} title="Compared to yesterday" />,
        },
        {
          title: "Avg Daily Attendance",
          value: avgDailyAttendance,
          icon: CalendarCheck,
          color: "text-[#00BFFF]",
          route: "/admin?tab=attendance",
          titleAttr: "Average across the last 7 days",
        },
        {
          title: "Expiring Soon",
          value: stats.expiringSoon,
          icon: AlertCircle,
          color: "text-red-400",
          route: "/admin?tab=members",
          titleAttr: "Expiring in 30 days",
        },
      ]
    : [];

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError || !stats) {
    return <DataUnavailable />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              type="button"
              key={card.title}
              title={card.titleAttr}
              onClick={() => navigate(card.route)}
              className={`flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl border border-white/5 bg-[#111111]/50 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 ${
                card.highlight ? "border-b-2 border-b-[#00BFFF]/40" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.title}</p>
                {card.badge}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-mono text-2xl font-bold tracking-tight text-white">{card.value}</p>
                <div className={`rounded-lg bg-white/[0.02] p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
          <div className="absolute left-0 top-0 h-full w-1 bg-[#00BFFF]" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Monthly Revenue Trend</h4>
              <p className="mt-0.5 font-mono text-xs text-gray-500">Paid revenue by month (INR)</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-[#00BFFF]" />
          </div>
          <div className="h-64 w-full">
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} labelStyle={revenueTooltipLabelStyle} />
                  <Line type="monotone" dataKey="revenue" stroke="#00BFFF" strokeWidth={3} activeDot={{ r: 7, strokeWidth: 1 }} dot={{ r: 3, strokeWidth: 1 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <DataUnavailable />
            )}
          </div>
        </div>

        {/* Weekly attendance area chart; falls back when the backend has no check-in data. */}
        <div className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
          <div className="absolute left-0 top-0 h-full w-1 bg-amber-400" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Attendance Trend</h4>
              <p className="mt-0.5 font-mono text-xs text-gray-500">Check-ins across the last 7 days</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-amber-400" />
          </div>
          <div className="h-64 w-full">
            {weeklyAttendance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAttendance} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="adminWeeklyAttendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" stroke="#666" fontSize={10} interval={0} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: "#fbbf24", fontWeight: "bold", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={2.5} fill="url(#adminWeeklyAttendanceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <DataUnavailable />
            )}
          </div>
        </div>

        <div className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
          <div className="absolute left-0 top-0 h-full w-1 bg-[#39FF14]" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Active Members</h4>
              <p className="mt-0.5 font-mono text-xs text-gray-500">Active membership count by month</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-[#39FF14]" />
          </div>
          <div className="h-64 w-full">
            {activeMembersTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeMembersTrend} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="adminActiveMembersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39FF14" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip contentStyle={chartTooltipStyle} labelStyle={activeMembersTooltipLabelStyle} />
                  <Area type="monotone" dataKey="count" stroke="#39FF14" strokeWidth={2.5} fill="url(#adminActiveMembersGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <DataUnavailable />
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-6 shadow-2xl lg:col-span-2">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Membership Status Overview</h4>
          {membershipStatus.length > 0 ? (
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <div className="flex h-44 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={membershipStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {membershipStatus.map((entry) => (
                        <Cell key={entry.name} fill={statusColors[entry.name] || "#9ca3af"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={membershipStatusTooltipStyle}
                      itemStyle={membershipStatusTooltipItemStyle}
                      labelStyle={membershipStatusTooltipLabelStyle}
                      formatter={(value) => [`${value} ${Number(value) === 1 ? "member" : "members"}`, "Status"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3.5 pr-4">
                {membershipStatus.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-white/[0.03] pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[item.name] || "#9ca3af" }} />
                      <span className="text-xs text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">{item.value} members</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DataUnavailable />
          )}
        </div>
      </div>
    </div>
  );
}
