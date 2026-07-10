import { useMemo, useState } from "react";
import { Crown, Search, ShieldCheck, UserCog, Users } from "lucide-react";

import { useGyms, useMembershipPlans, useSubscriptions, useUpdateProfile, useUsers } from "@/hooks/useApi";

const roleOptions = ["SuperAdmin", "GymAdmin", "Trainer", "Member"];

function initials(name?: string) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function roleClass(role: string) {
  if (role === "SuperAdmin") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (role === "GymAdmin") return "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]";
  if (role === "Trainer") return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  return "border-white/10 bg-white/5 text-gray-300";
}

export default function SuperAdminUsers() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const updateProfile = useUpdateProfile();
  const users = useUsers().data?.users || [];
  const gyms = useGyms().data?.gyms || [];
  const subscriptions = useSubscriptions().data?.subscriptions || [];
  const plans = useMembershipPlans().data?.memberships || [];

  const gymMap = useMemo(() => new Map(gyms.map((gym) => [gym.id, gym])), [gyms]);

  const premiumMemberIds = useMemo(() => {
    const planMap = new Map(plans.map((plan) => [plan.id, plan]));
    const now = Date.now();

    return new Set(
      subscriptions
        .filter((subscription) => {
          if (subscription.status === "Paused" || subscription.status === "Cancelled") return false;
          const start = new Date(subscription.startDate).getTime();
          const end = new Date(subscription.endDate).getTime();
          const plan = planMap.get(subscription.planId);
          return now >= start && now <= end && Boolean(plan?.name.toLowerCase().includes("premium"));
        })
        .map((subscription) => subscription.userId),
    );
  }, [plans, subscriptions]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = !query || [user.name, user.email, user.phone, user.id].join(" ").toLowerCase().includes(query);
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesPremium = !premiumOnly || (user.role === "Member" && premiumMemberIds.has(user.id));
      return matchesSearch && matchesRole && matchesPremium;
    });
  }, [filterRole, premiumMemberIds, premiumOnly, search, users]);

  const counts = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "GymAdmin").length,
      trainers: users.filter((user) => user.role === "Trainer").length,
      members: users.filter((user) => user.role === "Member").length,
    }),
    [users],
  );

  return (
    <div className="space-y-6" id="super-admin-users-panel">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {[
          { label: "Total Users", value: counts.total, icon: Users, color: "text-[#00BFFF]" },
          { label: "Gym Admins", value: counts.admins, icon: ShieldCheck, color: "text-[#39FF14]" },
          { label: "Trainers", value: counts.trainers, icon: UserCog, color: "text-amber-400" },
          { label: "Members", value: counts.members, icon: Crown, color: "text-purple-300" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">{item.label}</span>
                <div className="rounded-xl bg-white/[0.03] p-2">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>
              <p className="font-mono text-2xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card flex flex-col gap-3 rounded-2xl border border-white/5 p-5 shadow-xl md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name, email, phone or ID..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-[#00BFFF]/50 focus:outline-none"
            id="super-admin-user-search"
          />
        </div>

        <select
          value={filterRole}
          onChange={(event) => {
            setFilterRole(event.target.value);
            if (event.target.value !== "Member") setPremiumOnly(false);
          }}
          className="rounded-xl border border-white/5 bg-[#111] px-3 py-2.5 text-xs text-gray-300 focus:outline-none"
          id="super-admin-role-filter"
        >
          <option value="all">All Roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role === "SuperAdmin" ? "Super Admin" : role === "GymAdmin" ? "Gym Admin" : role}
            </option>
          ))}
        </select>

        {filterRole === "Member" && (
          <label className="flex items-center gap-2 rounded-xl border border-yellow-400/10 bg-yellow-400/5 px-3 py-2.5 text-xs font-bold text-yellow-300">
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={(event) => setPremiumOnly(event.target.checked)}
              className="h-4 w-4 rounded accent-yellow-400"
              id="premium-filter"
            />
            <Crown className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
            Premium only
          </label>
        )}
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Gym</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredUsers.map((user) => {
                const gym = user.gymId ? gymMap.get(user.gymId) : null;
                const isPremium = user.role === "Member" && premiumMemberIds.has(user.id);

                return (
                  <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="h-9 w-9 rounded-full border border-white/10 object-cover" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-white">
                              {initials(user.name)}
                            </div>
                          )}
                          {isPremium && <Crown className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 fill-yellow-400 text-yellow-500 drop-shadow" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="font-mono text-[10px] text-gray-500">#{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gray-400">{user.email}</td>
                    <td className="p-4">
                      {user.role === "SuperAdmin" ? (
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${roleClass(user.role)}`}>
                          Super Admin
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(event) => updateProfile.mutate({ id: user.id, data: { role: event.target.value } })}
                          disabled={updateProfile.isPending}
                          className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold uppercase focus:outline-none disabled:opacity-60 ${roleClass(user.role)}`}
                        >
                          <option value="GymAdmin">Gym Admin</option>
                          <option value="Trainer">Trainer</option>
                          <option value="Member">Member</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">{gym?.name || "-"}</td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-xs text-gray-500">
                    No users found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
