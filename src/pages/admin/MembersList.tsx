import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Download,
  Droplets,
  Edit2,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { MemberAccessPanel } from "@/components/admin/MemberAccessDialog";
import { ReusableDataTable, ReusableDataTableColumn } from "@/components/admin/ReusableDataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MembershipPlan, Subscription, User } from "@/data/types";
import { CreateUserPayload, UpdateProfilePayload, useCreateUser, useDeleteProfile, useMembershipPlans, useUpdateProfile, useUsers } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
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

function MemberFormFields({ form, setForm }: { form: MemberFormState; setForm: (form: MemberFormState) => void }) {
  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-1 flex w-full items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
          <UserRound className="h-4 w-4 text-primary" /> Personal Information
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
            <Label htmlFor="member-form-name" className="flex items-center gap-1.5 text-xs font-medium"><UserRound className="h-3 w-3 text-muted-foreground" />Full Name *</Label>
          <Input
              id="member-form-name"
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="e.g. Samir Patel"
          />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor="member-form-email" className="flex items-center gap-1.5 text-xs font-medium"><Mail className="h-3 w-3 text-muted-foreground" />Email *</Label>
          <Input
              id="member-form-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="member@example.com"
          />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor="member-form-phone" className="flex items-center gap-1.5 text-xs font-medium"><Phone className="h-3 w-3 text-muted-foreground" />Phone</Label>
          <Input
              id="member-form-phone"
            type="text"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="+91 91234 56789"
          />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor="member-form-dob" className="flex items-center gap-1.5 text-xs font-medium"><CalendarDays className="h-3 w-3 text-muted-foreground" />Date of Birth</Label>
          <Input
              id="member-form-dob"
            type="date"
            value={form.dob}
            onChange={(event) => setForm({ ...form, dob: event.target.value })}
          />
        </div>
        <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium"><UserRound className="h-3 w-3 text-muted-foreground" />Gender</Label>
            <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
            </Select>
        </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 flex w-full items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
          <Activity className="h-4 w-4 text-primary" /> Physical Information
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
            <Label htmlFor="member-form-height" className="text-xs font-medium">Height (cm)</Label>
          <Input
              id="member-form-height"
            type="number"
            value={form.height}
            onChange={(event) => setForm({ ...form, height: event.target.value })}
          />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor="member-form-weight" className="text-xs font-medium">Weight (kg)</Label>
          <Input
              id="member-form-weight"
            type="number"
            value={form.weight}
            onChange={(event) => setForm({ ...form, weight: event.target.value })}
          />
        </div>
        <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium"><Droplets className="h-3 w-3 text-muted-foreground" />Blood Group</Label>
            <Select value={form.bloodGroup} onValueChange={(value) => setForm({ ...form, bloodGroup: value })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <SelectItem key={group} value={group}>{group}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 flex w-full items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
          <ShieldAlert className="h-4 w-4 text-primary" /> Emergency Contact
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="member-form-emergency-name" className="text-xs font-medium">Contact Name</Label>
            <Input
              id="member-form-emergency-name"
              type="text"
              value={form.emergencyContactName}
              onChange={(event) => setForm({ ...form, emergencyContactName: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="member-form-emergency-phone" className="text-xs font-medium">Contact Phone</Label>
            <Input
              id="member-form-emergency-phone"
              type="text"
              value={form.emergencyContactPhone}
              onChange={(event) => setForm({ ...form, emergencyContactPhone: event.target.value })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 flex w-full items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
          <HeartPulse className="h-4 w-4 text-primary" /> Medical & Address
        </legend>
        <div className="space-y-1.5"><Label htmlFor="member-form-medical" className="text-xs font-medium">Medical Conditions</Label><Textarea id="member-form-medical" value={form.medicalConditions} onChange={(event) => setForm({ ...form, medicalConditions: event.target.value })} rows={2} /></div>
        <div className="space-y-1.5"><Label htmlFor="member-form-address" className="flex items-center gap-1.5 text-xs font-medium"><MapPin className="h-3 w-3 text-muted-foreground" />Address</Label><Textarea id="member-form-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows={2} /></div>
        <div className="space-y-1.5"><Label htmlFor="member-form-timings" className="text-xs font-medium">Timings</Label><Input id="member-form-timings" value={form.timings} onChange={(event) => setForm({ ...form, timings: event.target.value })} placeholder="e.g. 06:00 AM - 11:00 AM" /></div>
      </fieldset>
    </div>
  );
}

export default function MembersList() {
  const membersQuery = useUsers({ role: "Member", include: "subscription,workout_plan" });
  const plansQuery = useMembershipPlans();
  const members = useMemo(() => membersQuery.data?.users ?? [], [membersQuery.data?.users]);
  const plans = useMemo(() => plansQuery.data?.memberships ?? [], [plansQuery.data?.memberships]);
  const createUser = useCreateUser();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<(typeof statusOptions)[number]>("All");
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: MembershipPlan; subscription: Subscription } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<MemberFormState>(emptyForm);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<MemberFormState>(emptyForm);
  const [editingRole, setEditingRole] = useState<"Member" | "Trainer">("Member");
  const [pendingDeleteMember, setPendingDeleteMember] = useState<User | null>(null);

  const currentEditingMember = editingMember
    ? members.find((member) => member.id === editingMember.id) || editingMember
    : null;

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
    setEditingRole(member.role === "Trainer" ? "Trainer" : "Member");
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
      { id: editingMember.id, data: { ...formToPayload(editForm), role: editingRole } as UpdateProfilePayload },
      {
        onSuccess: () => {
          toast({
            title: editingRole === "Trainer" ? "Member promoted to Trainer" : "Member profile updated",
            description: editingRole !== editingMember.role ? "The biometric device role has been synchronized." : undefined,
          });
          setEditingMember(null);
          setEditForm(emptyForm);
        },
        onError: (error) => toast({ title: "Unable to update member", description: error.message, variant: "destructive" }),
      },
    );
  };

  const confirmDeleteMember = () => {
    if (!pendingDeleteMember) return;
    const member = pendingDeleteMember;

    deleteProfile.mutate(member.id, {
      onSuccess: () => {
        if (editingMember?.id === member.id) setEditingMember(null);
        setPendingDeleteMember(null);
      },
    });
  };

  const memberTableColumns: ReusableDataTableColumn<User>[] = [
    {
      key: "id",
      header: "Member ID",
      width: "9%",
      render: (member) => (
        <span className="inline-flex rounded border border-[#00BFFF]/10 bg-[#00BFFF]/5 px-2 py-1 font-mono text-xs font-bold text-[#00BFFF]">
          #{member.id}
        </span>
      ),
    },
    {
      key: "member",
      header: "Member",
      width: "21%",
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
                onClick={() => openEditModal(member)}
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
      width: "11%",
      cellClassName: "font-mono text-xs font-semibold text-gray-300",
      render: (member) => <span className="block truncate">{member.phone || "—"}</span>,
    },
    {
      key: "plan",
      header: "Membership Plan",
      width: "10%",
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
      key: "start-date",
      header: "Start Date",
      width: "11%",
      headerClassName: "px-3",
      cellClassName: "px-3 font-mono text-[11px] font-semibold text-gray-400",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        return sub ? <span className="whitespace-nowrap">{formatDate(sub.startDate)}</span> : "—";
      },
    },
    {
      key: "end-date",
      header: "End Date",
      width: "11%",
      headerClassName: "px-3",
      cellClassName: "px-3 font-mono text-[11px] font-semibold text-gray-200",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        return sub ? <span className="whitespace-nowrap">{formatDate(sub.endDate)}</span> : "—";
      },
    },
    {
      key: "status",
      header: "Status",
      width: "9%",
      render: (member) => {
        const sub = getPrimarySubscription(member);
        const status = sub?.status || "No Plan";

        return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClass(status)}`}>{status}</span>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "14%",
      headerClassName: "px-2 text-center",
      cellClassName: "px-2",
      render: (member) => (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => openEditModal(member)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/10 hover:text-[#00BFFF]"
            aria-label={`Manage ${member.name}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Manage
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

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="flex max-h-[85vh] w-[95vw] flex-col gap-0 overflow-hidden border-border p-0 shadow-2xl sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
          {editingMember && (
            <>
              <div className="border-b p-6 pb-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {editingMember.photoUrl ? <img src={editingMember.photoUrl} alt={editingMember.name} className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5 text-primary" />}
                    </span>
                    Edit Member Profile
                  </DialogTitle>
                  <DialogDescription>View and update this member's profile, membership, and access settings.</DialogDescription>
                </DialogHeader>
              </div>

              <form onSubmit={handleUpdateSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto bg-accent/5 p-6">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Avatar className="h-24 w-24 border-4 border-background bg-primary/10 shadow-sm">
                      {editingMember.photoUrl && <AvatarImage src={editingMember.photoUrl} alt={editingMember.name} className="object-cover" />}
                      <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">{getInitials(editingMember.name)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground">{editingMember.name}</h3>
                      <p className="text-sm text-muted-foreground">{editingMember.email}</p>
                    </div>
                  </div>

                  <MemberFormFields form={editForm} setForm={setEditForm} />

                  <fieldset className="space-y-4">
                    <legend className="mb-1 flex w-full items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
                      <CreditCard className="h-4 w-4 text-primary" /> Access Control Settings
                    </legend>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Access Role</Label>
                      <Select value={editingRole} onValueChange={(value) => setEditingRole(value as "Member" | "Trainer")}>
                        <SelectTrigger id="member-role-selector"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Member">Member</SelectItem><SelectItem value="Trainer">Trainer</SelectItem></SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Role changes synchronize biometric access immediately. Trainers receive permanent access; members require an active subscription.</p>
                    </div>
                    {currentEditingMember && <MemberAccessPanel member={currentEditingMember} plans={plans} />}
                  </fieldset>
                </div>

                <div className="border-t bg-card p-6 pt-4">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => {
                        setPendingDeleteMember(editingMember);
                        setEditingMember(null);
                      }}
                      disabled={updateProfile.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Profile
                    </Button>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button variant="outline" type="button" onClick={() => setEditingMember(null)} disabled={updateProfile.isPending}>Cancel</Button>
                      <Button type="submit" disabled={updateProfile.isPending}>{updateProfile.isPending ? "Saving..." : "Save Changes"}</Button>
                    </DialogFooter>
                  </div>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

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
