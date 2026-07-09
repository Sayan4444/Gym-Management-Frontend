import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckSquare, ChevronLeft, ChevronRight, Crown, Download, Edit2, Plus, Search, Sparkles, Trash2, Users, X } from "lucide-react";

import { ReusableDataTable, ReusableDataTableColumn } from "@/components/admin/ReusableDataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MembershipPlan, Subscription, User } from "@/data/types";
import { CreateUserPayload, UpdateProfilePayload, useCreateUser, useDeleteProfile, useUpdateProfile, useUsers } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

const statusOptions = ["All", "Active", "Expired", "Paused", "Upcoming", "Cancelled", "No Plan"] as const;

interface MemberFormState {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  timings: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  height: string;
  weight: string;
  medicalConditions: string;
}

const emptyForm: MemberFormState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "Male",
  address: "",
  timings: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  bloodGroup: "",
  height: "",
  weight: "",
  medicalConditions: "",
};

function getInitials(name?: string) {
  return (name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPrimarySubscription(member: User) {
  const subscriptions = member.subscription || [];
  const statusRank: Record<string, number> = {
    Active: 0,
    Upcoming: 1,
    Paused: 2,
    Expired: 3,
    Cancelled: 4,
  };

  return [...subscriptions].sort((first, second) => {
    const rankDiff = (statusRank[first.status] ?? 5) - (statusRank[second.status] ?? 5);
    if (rankDiff !== 0) return rankDiff;
    return new Date(second.endDate).getTime() - new Date(first.endDate).getTime();
  })[0];
}

function getStatusClass(status?: string) {
  if (status === "Active") return "border-[#39FF14]/10 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Expired" || status === "Cancelled") return "border-red-400/10 bg-red-400/10 text-red-400";
  if (status === "Frozen" || status === "Paused") return "border-amber-400/10 bg-amber-400/10 text-amber-400";
  if (status === "Upcoming" || status === "Pending") return "border-[#00BFFF]/10 bg-[#00BFFF]/10 text-[#00BFFF]";
  return "border-white/10 bg-white/5 text-gray-400";
}

function numberOrNull(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value.trim() !== "" ? parsed : null;
}

function formToPayload(form: MemberFormState): Omit<CreateUserPayload, "name" | "email"> & Pick<CreateUserPayload, "name" | "email"> {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    dob: form.dob,
    gender: form.gender,
    address: form.address.trim(),
    timings: form.timings.trim() || null,
    emergencyContactName: form.emergencyContactName.trim(),
    emergencyContactPhone: form.emergencyContactPhone.trim(),
    bloodGroup: form.bloodGroup.trim(),
    height: numberOrNull(form.height),
    weight: numberOrNull(form.weight),
    medicalConditions: form.medicalConditions.trim(),
  };
}

function memberToForm(member: User): MemberFormState {
  return {
    name: member.name || "",
    email: member.email || "",
    phone: member.phone || "",
    dob: member.dob || "",
    gender: member.gender || "Male",
    address: member.address || "",
    timings: member.timings || "",
    emergencyContactName: member.emergencyContactName || "",
    emergencyContactPhone: member.emergencyContactPhone || "",
    bloodGroup: member.bloodGroup || "",
    height: member.height ? String(member.height) : "",
    weight: member.weight ? String(member.weight) : "",
    medicalConditions: member.medicalConditions || "",
  };
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="min-h-5 text-sm font-semibold text-white">{value || "Not provided"}</p>
    </div>
  );
}

function MemberProfileDialog({
  user,
  open,
  onOpenChange,
  onEdit,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
}) {
  const subscription = user ? getPrimarySubscription(user) : undefined;
  const plan = subscription?.plan;
  const status = subscription?.status || "No Plan";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border-white/10 bg-[#090909] p-0 text-white shadow-[0_0_50px_rgba(0,191,255,0.16)]">
        {user && (
          <>
            <div className="relative border-b border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(0,191,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(57,255,20,0.12),transparent_28%)] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20 rounded-2xl border border-white/15 shadow-2xl">
                  {user.photoUrl && <AvatarImage src={user.photoUrl} alt={user.name} className="object-cover" />}
                  <AvatarFallback className="rounded-2xl bg-[#00BFFF]/10 text-xl font-black text-[#00BFFF]">{getInitials(user.name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded border border-[#00BFFF]/10 bg-[#00BFFF]/5 px-2 py-1 font-mono text-[10px] font-bold text-[#00BFFF]">#{user.id}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClass(status)}`}>{status}</span>
                    {plan?.name?.toLowerCase().includes("premium") && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                        <Crown className="h-3 w-3 fill-yellow-300" /> Premium
                      </span>
                    )}
                  </div>
                  <DialogHeader>
                    <DialogTitle className="truncate text-2xl font-black uppercase tracking-tight text-white">{user.name}</DialogTitle>
                  </DialogHeader>
                  <p className="mt-1 truncate font-mono text-xs text-gray-400">{user.email}</p>
                  <p className="mt-1 font-mono text-xs text-gray-500">{user.phone || "No phone number"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black shadow-[0_0_18px_rgba(0,191,255,0.2)]"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Details
                </button>
              </div>
            </div>

            <div className="max-h-[62vh] space-y-5 overflow-y-auto p-6">
              <div>
                <h4 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#39FF14]">Membership Matrix</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <DetailItem label="Plan" value={plan?.name} />
                  <DetailItem label="Started" value={subscription?.startDate ? formatDate(subscription.startDate) : undefined} />
                  <DetailItem label="Ends" value={subscription?.endDate ? formatDate(subscription.endDate) : undefined} />
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#00BFFF]">Member Profile</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <DetailItem label="Gender" value={user.gender} />
                  <DetailItem label="Date of Birth" value={user.dob ? formatDate(user.dob) : undefined} />
                  <DetailItem label="Height" value={user.height ? `${user.height} cm` : undefined} />
                  <DetailItem label="Weight" value={user.weight ? `${user.weight} kg` : undefined} />
                  <DetailItem label="Blood Group" value={user.bloodGroup} />
                  <DetailItem label="Address" value={user.address} />
                  <DetailItem label="Timings" value={user.timings} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-4">
                <h4 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">Health & Emergency</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <DetailItem label="Emergency Contact" value={user.emergencyContactName} />
                  <DetailItem label="Emergency Phone" value={user.emergencyContactPhone} />
                </div>
                <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-3">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">Medical Conditions</p>
                  <p className="text-sm leading-relaxed text-gray-300">{user.medicalConditions || "No medical conditions recorded."}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MemberFormFields({ form, setForm }: { form: MemberFormState; setForm: (form: MemberFormState) => void }) {
  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Member Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="e.g. Samir Patel"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="member@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Mobile Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="+91 91234 56789"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Date of Birth</label>
          <input
            type="date"
            value={form.dob}
            onChange={(event) => setForm({ ...form, dob: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Gender</label>
          <select
            value={form.gender}
            onChange={(event) => setForm({ ...form, gender: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          >
            <option value="Male" className="bg-neutral-900">Male</option>
            <option value="Female" className="bg-neutral-900">Female</option>
            <option value="Other" className="bg-neutral-900">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Height (cm)</label>
          <input
            type="number"
            value={form.height}
            onChange={(event) => setForm({ ...form, height: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Weight (kg)</label>
          <input
            type="number"
            value={form.weight}
            onChange={(event) => setForm({ ...form, weight: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Blood Group</label>
          <input
            type="text"
            value={form.bloodGroup}
            onChange={(event) => setForm({ ...form, bloodGroup: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-400">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(event) => setForm({ ...form, address: event.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-400">Timings</label>
        <input
          type="text"
          value={form.timings}
          onChange={(event) => setForm({ ...form, timings: event.target.value })}
          placeholder="e.g. 06:00 AM - 11:00 AM"
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.01] p-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#39FF14]">Emergency contact index</h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Contact Person</label>
            <input
              type="text"
              value={form.emergencyContactName}
              onChange={(event) => setForm({ ...form, emergencyContactName: event.target.value })}
              className="w-full rounded border border-white/5 bg-[#111] p-2 text-xs text-white focus:border-[#39FF14]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Emergency Phone</label>
            <input
              type="text"
              value={form.emergencyContactPhone}
              onChange={(event) => setForm({ ...form, emergencyContactPhone: event.target.value })}
              className="w-full rounded border border-white/5 bg-[#111] p-2 text-xs text-white focus:border-[#39FF14]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-400">Medical Conditions</label>
        <textarea
          value={form.medicalConditions}
          onChange={(event) => setForm({ ...form, medicalConditions: event.target.value })}
          rows={3}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:border-[#00BFFF] focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function MembersList() {
  const membersQuery = useUsers({ role: "Member", include: "subscription,workout_plan" });
  const members = useMemo(() => membersQuery.data?.users ?? [], [membersQuery.data?.users]);
  const createUser = useCreateUser();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<(typeof statusOptions)[number]>("All");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: MembershipPlan; subscription: Subscription } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<MemberFormState>(emptyForm);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<MemberFormState>(emptyForm);
  const [pendingDeleteMember, setPendingDeleteMember] = useState<User | null>(null);

  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return members.filter((member) => {
      const sub = getPrimarySubscription(member);
      const matchesSearch =
        !searchValue ||
        String(member.id).includes(searchValue) ||
        member.name?.toLowerCase().includes(searchValue) ||
        member.email?.toLowerCase().includes(searchValue) ||
        member.phone?.toLowerCase().includes(searchValue) ||
        member.timings?.toLowerCase().includes(searchValue);

      if (!matchesSearch) return false;
      if (filterStatus === "All") return true;
      if (filterStatus === "No Plan") return !sub;
      return sub?.status === filterStatus;
    });
  }, [filterStatus, members, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedMembers = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const csvRows = [
      ["Member ID", "Name", "Email", "Phone", "Status", "Plan", "Start Date", "End Date"].join(","),
      ...filtered.map((member) => {
        const sub = getPrimarySubscription(member);
        return [member.id, member.name, member.email, member.phone, sub?.status || "No Plan", sub?.plan?.name || "", sub?.startDate || "", sub?.endDate || ""]
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",");
      }),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Transform360_Members_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const goToPage = (nextPage: number | ((current: number) => number)) => {
    setPage((current) => {
      const value = typeof nextPage === "function" ? nextPage(current) : nextPage;
      return Math.min(totalPages, Math.max(1, value));
    });
  };

  const openEditModal = (member: User) => {
    setEditingMember(member);
    setEditForm(memberToForm(member));
  };

  const handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();
    createUser.mutate(
      { ...formToPayload(addForm), role: "Member" },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setAddForm(emptyForm);
          setPage(1);
        },
      },
    );
  };

  const handleUpdateSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingMember) return;

    updateProfile.mutate(
      { id: editingMember.id, data: formToPayload(editForm) as UpdateProfilePayload },
      {
        onSuccess: () => {
          setEditingMember(null);
          setEditForm(emptyForm);
        },
      },
    );
  };

  const confirmDeleteMember = () => {
    if (!pendingDeleteMember) return;
    const member = pendingDeleteMember;

    deleteProfile.mutate(member.id, {
      onSuccess: () => {
        if (selectedUser?.id === member.id) setSelectedUser(null);
        if (editingMember?.id === member.id) setEditingMember(null);
        setPendingDeleteMember(null);
      },
    });
  };

  const memberTableColumns: ReusableDataTableColumn<User>[] = [
    {
      key: "id",
      header: "Member ID",
      width: "10%",
      render: (member) => (
        <span className="inline-flex rounded border border-[#00BFFF]/10 bg-[#00BFFF]/5 px-2 py-1 font-mono text-xs font-bold text-[#00BFFF]">
          #{member.id}
        </span>
      ),
    },
    {
      key: "member",
      header: "Member",
      width: "24%",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        const plan = sub?.plan;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9 rounded-lg border border-white/10">
                {member.photoUrl && <AvatarImage src={member.photoUrl} alt={member.name} className="object-cover" />}
                <AvatarFallback className="rounded-lg bg-[#00BFFF]/10 text-xs font-bold text-[#00BFFF]">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              {plan?.name?.toLowerCase().includes("premium") && (
                <Crown className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 fill-yellow-400 text-yellow-500 drop-shadow" />
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <button
                type="button"
                onClick={() => setSelectedUser(member)}
                className="truncate text-left text-xs font-bold text-white transition-colors hover:text-[#00BFFF]"
              >
                {member.name}
              </button>
              <span className="truncate font-mono text-[10px] text-gray-500">{member.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone",
      header: "Phone",
      width: "13%",
      cellClassName: "font-mono text-xs font-semibold text-gray-300",
      render: (member) => <span className="block truncate">{member.phone || "—"}</span>,
    },
    {
      key: "plan",
      header: "Membership Plan",
      width: "16%",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        const plan = sub?.plan;

        return plan && sub ? (
          <button
            type="button"
            onClick={() => setSelectedPlan({ plan, subscription: sub })}
            className="block max-w-full truncate text-left text-xs font-semibold text-white transition-colors hover:text-[#00BFFF]"
          >
            {plan.name}
          </button>
        ) : (
          <span className="text-xs text-gray-500">—</span>
        );
      },
    },
    {
      key: "expiry",
      header: "Expiry Range",
      width: "19%",
      cellClassName: "font-mono text-[11px] text-gray-400",
      render: (member) => {
        const sub = getPrimarySubscription(member);

        return sub ? (
          <div className="flex min-w-0 items-center gap-1 whitespace-nowrap">
            <span className="font-semibold">{formatDate(sub.startDate)}</span>
            <span className="text-gray-600">to</span>
            <span className="font-semibold text-gray-200">{formatDate(sub.endDate)}</span>
          </div>
        ) : (
          "—"
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "10%",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        const status = sub?.status || "No Plan";

        return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClass(status)}`}>{status}</span>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "8%",
      headerClassName: "text-center",
      render: (member) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedUser(member)}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-gray-400 transition-all hover:bg-[#00BFFF]/10 hover:text-[#00BFFF]"
            title="View Profile"
          >
            <Users className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(member)}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-gray-400 transition-all hover:bg-[#39FF14]/10 hover:text-[#39FF14]"
            title="Edit Details"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDeleteMember(member)}
            disabled={deleteProfile.isPending}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete Member"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" id="member-management">
      <div className="glass-card flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-white/5 p-5 shadow-xl md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, email, phone or timings..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 font-sans text-xs text-white transition-all placeholder:text-gray-500 focus:border-[#00BFFF]/40 focus:outline-none"
              id="search-members"
            />
          </div>

          <div className="flex self-start rounded-xl border border-white/5 bg-white/[0.02] p-1 md:self-auto">
            {statusOptions.map((filterOption) => (
              <button
                key={filterOption}
                type="button"
                onClick={() => {
                  setFilterStatus(filterOption);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterStatus === filterOption ? "bg-[#00BFFF] font-bold text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white"
            id="export-csv-btn"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black shadow-[0_0_15px_rgba(0,191,255,0.25)] transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
            id="add-member-btn"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <ReusableDataTable
          id="members-list-table"
          data={paginatedMembers}
          columns={memberTableColumns}
          getRowKey={(member) => member.id}
          emptyMessage="No gym members found matching your search."
        />

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 bg-black/20 px-6 py-4 sm:flex-row">
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
            Showing <span className="font-bold text-white">{filtered.length === 0 ? 0 : startIndex + 1}</span>-
            <span className="font-bold text-white">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of
            <span className="font-bold text-white"> {filtered.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => goToPage((current) => current - 1)} disabled={page === 1} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-gray-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-white">
              Page {page} / {totalPages}
            </span>
            <button type="button" onClick={() => goToPage((current) => current + 1)} disabled={page === totalPages} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-gray-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <MemberProfileDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onEdit={(user) => {
          setSelectedUser(null);
          openEditModal(user);
        }}
      />

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-w-md border-white/10 bg-[#090909] text-white">
          <DialogHeader>
            <DialogTitle>Plan & Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedPlan?.plan && selectedPlan?.subscription && (
            <div className="space-y-3 pt-4 text-sm">
              <div className="mb-2 text-base font-medium">Plan Details</div>
              <div className="grid grid-cols-3 border-b border-white/10 pb-2">
                <span className="mr-4 text-right text-gray-400">Name:</span>
                <span className="col-span-2 font-medium">{selectedPlan.plan.name}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-white/10 pb-2">
                <span className="mr-4 text-right text-gray-400">Price:</span>
                <span className="col-span-2">₹{selectedPlan.plan.price}</span>
              </div>
              <div className="grid grid-cols-3 pb-2">
                <span className="mr-4 text-right text-gray-400">Duration:</span>
                <span className="col-span-2">{selectedPlan.plan.durationMonths} months</span>
              </div>

              <div className="mb-2 mt-6 border-t border-white/10 pt-4 text-base font-medium">Subscription Details</div>
              <div className="grid grid-cols-3 border-b border-white/10 pb-2">
                <span className="mr-4 text-right text-gray-400">Status:</span>
                <span className="col-span-2">
                  <Badge variant="outline" className={getStatusClass(selectedPlan.subscription.status)}>
                    {selectedPlan.subscription.status}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 border-b border-white/10 pb-2">
                <span className="mr-4 text-right text-gray-400">Started On:</span>
                <span className="col-span-2">{formatDate(selectedPlan.subscription.startDate)}</span>
              </div>
              <div className="grid grid-cols-3 pb-2">
                <span className="mr-4 text-right text-gray-400">Ends On:</span>
                <span className="col-span-2">{formatDate(selectedPlan.subscription.endDate)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#00BFFF]/35 bg-[#090909] p-6 shadow-[0_0_40px_rgba(0,191,255,0.15)]"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#00BFFF]/10 p-1.5 text-[#00BFFF]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-base font-bold uppercase tracking-wider text-white">Onboard Member Profile</h3>
                </div>
                <button type="button" onClick={() => setIsAddOpen(false)} className="rounded bg-white/5 p-1.5 text-gray-400 transition-colors hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <MemberFormFields form={addForm} setForm={setAddForm} />
                <div className="mt-4 flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-2.5 font-bold text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={createUser.isPending} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black transition-opacity hover:opacity-90 disabled:opacity-50">
                    <CheckSquare className="h-4 w-4" />
                    <span>{createUser.isPending ? "Saving..." : "Authorize Onboarding"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#39FF14]/35 bg-[#090909] p-6 shadow-[0_0_40px_rgba(57,255,20,0.15)]"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  Edit Details - <span className="text-[#39FF14]">#{editingMember.id}</span>
                </h3>
                <button type="button" onClick={() => setEditingMember(null)} className="rounded bg-white/5 p-1.5 text-gray-400 transition-colors hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <MemberFormFields form={editForm} setForm={setEditForm} />
                <div className="mt-4 flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setEditingMember(null)} className="rounded-xl border border-white/10 bg-white/[0.02]/50 px-5 py-2.5 text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateProfile.isPending} className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black disabled:opacity-50">
                    {updateProfile.isPending ? "Applying..." : "Apply Modifications"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDeleteMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#090909] text-white shadow-[0_0_55px_rgba(239,68,68,0.18)]"
            >
              <div className="relative border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(0,191,255,0.08),transparent_32%)] p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/25 bg-red-500/10 text-red-300 shadow-[0_0_24px_rgba(239,68,68,0.2)]">
                  <Trash2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">Delete Member?</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  This removes the member profile from this gym workspace. This action cannot be undone.
                </p>
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                  <Avatar className="h-12 w-12 rounded-xl border border-white/10">
                    {pendingDeleteMember.photoUrl && <AvatarImage src={pendingDeleteMember.photoUrl} alt={pendingDeleteMember.name} className="object-cover" />}
                    <AvatarFallback className="rounded-xl bg-red-500/10 text-sm font-black text-red-300">{getInitials(pendingDeleteMember.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{pendingDeleteMember.name}</p>
                    <p className="truncate font-mono text-[11px] text-gray-500">{pendingDeleteMember.email}</p>
                  </div>
                  <span className="rounded border border-red-400/15 bg-red-400/10 px-2 py-1 font-mono text-[10px] font-bold text-red-300">
                    #{pendingDeleteMember.id}
                  </span>
                </div>

                <div className="mb-5 rounded-xl border border-red-500/10 bg-red-500/[0.04] p-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">Deletion impact</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Attendance, subscriptions, payments, and linked records may remain as historical database records, but this member profile will no longer appear in member management.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPendingDeleteMember(null)}
                    disabled={deleteProfile.isPending}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-bold text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    Keep Member
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteMember}
                    disabled={deleteProfile.isPending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500 px-5 py-2.5 text-xs font-black text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-colors hover:bg-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleteProfile.isPending ? "Deleting..." : "Delete Member"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
