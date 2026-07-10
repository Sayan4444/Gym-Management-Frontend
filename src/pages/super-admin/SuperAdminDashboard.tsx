import { AnimatedTabPanel } from "@/components/AnimatedTabPanel";
import { useGyms, useUsers, useSuperAdminDashboardStats } from "@/hooks/useApi";
import { ArrowUpRight, Building2, CreditCard, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useSearchParams } from "react-router-dom";
import GymManagement from "./GymManagement";
import SuperAdminUsers from "./SuperAdminUsers";

export default function SuperAdminDashboard() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const gyms = useGyms().data?.gyms || [];
  const users = useUsers().data?.users || [];
  const { data: stats } = useSuperAdminDashboardStats();

  const totalMembers = stats?.totalMembers ?? 0;
  const totalTrainers = users.filter((u) => u.role === "Trainer").length;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const activeSubscriptions = stats?.activeMemberships ?? 0;

  const gymStats = gyms.map((g) => ({
    name: g.name,
    members: users.filter((u) => u.gymId === g.id && u.role === "Member").length,
  }));

  // TODO: Replace static trend badges with backend-computed super-admin trend metrics.
  const kpis = [
    { title: "Total Gyms", value: gyms.length, badge: "+12%", icon: Building2, color: "text-[#00BFFF]" },
    { title: "Total Members", value: totalMembers, badge: "+8.4%", icon: Users, color: "text-[#39FF14]" },
    { title: "Active Subs", value: activeSubscriptions, badge: "+14%", icon: TrendingUp, color: "text-amber-400" },
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, badge: "Goal Reached", icon: CreditCard, color: "text-purple-400", highlight: true },
  ];

  return (
    <AnimatedTabPanel panelKey={currentTab}>
      <div className="space-y-8">
        {currentTab === "overview" && (
          <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.title}
                className={`flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl border border-white/5 bg-[#111111]/50 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 ${
                  k.highlight ? "border-b-2 border-b-[#00BFFF]/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{k.title}</p>
                  <span className="rounded bg-[#39FF14]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#39FF14]">{k.badge}</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="truncate font-mono text-2xl font-bold tracking-tight text-white">{k.value}</p>
                  <div className={`rounded-lg bg-white/[0.02] p-2 ${k.color}`}>
                    <k.icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#00BFFF]" />
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Members by Gym</h4>
                  <p className="mt-0.5 font-mono text-xs text-gray-500">Cross-location active headcount</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-[#00BFFF]" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gymStats} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="superAdminBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00BFFF" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#39FF14" stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#090909", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                    <Bar dataKey="members" fill="url(#superAdminBarGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#39FF14]" />
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Network Growth Velocity</h4>
                  <p className="mt-0.5 font-mono text-xs text-gray-500">Gym distribution health index</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-[#39FF14]" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gymStats} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="superAdminGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39FF14" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#090909", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                    <Area type="monotone" dataKey="members" stroke="#39FF14" strokeWidth={2.5} fill="url(#superAdminGrowthGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </div>
        )}

        {currentTab === "gyms" && <GymManagement />}
        {currentTab === "users" && <SuperAdminUsers />}
      </div>
    </AnimatedTabPanel>
  );
}
