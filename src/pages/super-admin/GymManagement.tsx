import { Building2, CreditCard, Dumbbell, MapPin, ShieldCheck, Users } from "lucide-react";

import { useGyms, usePayments, useUsers } from "@/hooks/useApi";
import { Gym } from "@/data/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);

function GymCard({ gym }: { gym: Gym }) {
  const users = useUsers({ gymId: gym.id, include: "subscription" }).data?.users || [];
  const payments = usePayments({ gym_id: gym.id, status: "Paid" }).data?.payments || [];

  const members = users.filter((user) => user.role === "Member").length;
  const trainers = users.filter((user) => user.role === "Trainer").length;
  const activeSubs = users.filter((user) => user.subscription?.some((subscription) => subscription.status === "Active" || subscription.status === "")).length;
  const revenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <div className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl transition-colors hover:border-[#00BFFF]/20" data-gym-id={gym.id}>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#00BFFF]/20 to-[#39FF14]/10">
            {gym.gymIcon ? (
              <img src={gym.gymIcon} alt={gym.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-[#00BFFF]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#39FF14]">Gym #{gym.id}</p>
            <h3 className="mt-1 truncate text-lg font-black uppercase tracking-tight text-white">{gym.name}</h3>
            <p className="mt-1 flex max-w-xl items-start gap-1.5 text-xs leading-relaxed text-gray-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
              <span>{gym.address || "Address not configured"}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[520px]">
          {[
            { label: "Members", value: members, icon: Users, color: "text-[#00BFFF]" },
            { label: "Trainers", value: trainers, icon: Dumbbell, color: "text-amber-400" },
            { label: "Active Subs", value: activeSubs, icon: ShieldCheck, color: "text-[#39FF14]" },
            { label: "Revenue", value: `₹${formatCurrency(revenue)}`, icon: CreditCard, color: "text-purple-300" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <Icon className={`mx-auto mb-2 h-4 w-4 ${item.color}`} />
                <p className="font-mono text-lg font-black text-white">{item.value}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function GymManagement() {
  const { data, isLoading } = useGyms();
  const gyms = data?.gyms || [];

  return (
    <div className="space-y-6" id="super-admin-gyms-panel">
      <div className="glass-card flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#00BFFF]/5 p-5 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Network Registry</span>
          <h1 className="mt-1 text-xl font-black uppercase tracking-tight text-white">Gym Management</h1>
          <p className="mt-1 text-xs text-gray-400">{gyms.length} gyms registered across the platform</p>
        </div>
        <span className="rounded-xl border border-[#39FF14]/20 bg-[#39FF14]/10 px-3 py-1 font-mono text-xs font-bold uppercase text-[#39FF14]">
          Live Network
        </span>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-xs text-gray-500">Loading gym registry...</div>
        ) : gyms.length > 0 ? (
          gyms.map((gym) => <GymCard key={gym.id} gym={gym} />)
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <p className="text-sm font-bold text-white">No gyms registered</p>
            <p className="mt-1 text-xs text-gray-500">Gym records will appear here when they are created.</p>
          </div>
        )}
      </div>
    </div>
  );
}
