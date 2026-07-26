import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Edit2, Mail, Phone, Plus, Search, Trash2, Users, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateUserPayload, UpdateProfilePayload, useCreateUser, useDeleteProfile, useUpdateProfile, useUsers } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/data/types";

interface TrainerFormState {
  name: string;
  phone: string;
  email: string;
  timings: string;
}

const defaultTrainerForm: TrainerFormState = {
  name: "",
  phone: "",
  email: "",
  timings: "",
};

function getInitials(name?: string) {
  return (name || "T")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTrainerSchedule(trainer: User) {
  return trainer.timings?.trim();
}

function trainerFormToPayload(form: TrainerFormState): Omit<CreateUserPayload, "role"> {
  return {
    name: form.name.trim(),
    email: form.email.trim() || `${form.name.toLowerCase().replace(/\s+/g, ".")}@transform360.com`,
    phone: form.phone.trim(),
    timings: form.timings.trim() || null,
  };
}

function trainerToForm(trainer: User): TrainerFormState {
  return {
    name: trainer.name || "",
    phone: trainer.phone || "",
    email: trainer.email || "",
    timings: trainer.timings || "",
  };
}

function TrainerFormFields({ form, setForm }: { form: TrainerFormState; setForm: (form: TrainerFormState) => void }) {
  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="space-y-1.5">
        <label className="font-bold text-gray-400">Trainer Full Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="e.g. Ramesh Dev"
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Mobile Number *</label>
          <input
            type="text"
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="e.g. +91 90000 88888"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-gray-400">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="e.g. coach@transform360.com"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-400">Timings</label>
        <input
          type="text"
          value={form.timings}
          onChange={(event) => setForm({ ...form, timings: event.target.value })}
          placeholder="e.g. 06:00 AM - 11:00 AM, 05:00 PM - 09:00 PM"
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:outline-none"
        />
      </div>
    </div>
  );
}

function TrainerCard({
  trainer,
  index,
  onAssign,
  onEdit,
  onDelete,
  onCall,
  isDeleting,
}: {
  trainer: User;
  index: number;
  onAssign: (trainer: User) => void;
  onEdit: (trainer: User) => void;
  onDelete: (trainer: User) => void;
  onCall: (phone: string) => void;
  isDeleting: boolean;
}) {
  const assignedMembersQuery = useUsers({ role: "Member", trainerId: trainer.id });
  const assignedMembers = assignedMembersQuery.data?.count ?? 0;
  const schedule = getTrainerSchedule(trainer);

  return (
    <motion.div
      key={trainer.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col gap-5 rounded-2xl border border-white/5 bg-[#0b0b0b] p-5 shadow-2xl transition-all hover:border-[#00BFFF]/20 sm:flex-row"
      id={`trainer-card-${trainer.id}`}
    >
      <div className="flex select-none flex-col items-center sm:items-start">
        <div className="relative h-24 w-24 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#39FF14] p-0.5 sm:h-28 sm:w-28">
          <Avatar className="h-full w-full rounded-xl border-0">
            {trainer.photoUrl && <AvatarImage src={trainer.photoUrl} alt={trainer.name} className="rounded-xl object-cover" />}
            <AvatarFallback className="rounded-xl bg-[#111] text-xl font-black text-[#00BFFF]">
              {getInitials(trainer.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between text-center sm:text-left">
        <div>
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <h4 className="text-sm font-extrabold tracking-tight text-white transition-colors group-hover:text-[#00BFFF]">
              {trainer.name}
            </h4>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            {schedule && (
              <div className="flex items-center justify-center gap-2.5 text-gray-400 sm:justify-start">
                <Clock className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                <span className="truncate text-[11px]">{schedule}</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-2.5 text-gray-400 sm:justify-start">
              <Users className="h-3.5 w-3.5 shrink-0 text-[#00BFFF]" />
              <span className="font-mono text-[11px] font-bold">
                {assignedMembersQuery.isLoading ? "Loading Assigned Members" : `${assignedMembers} Assigned Members`}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-gray-400 sm:justify-start">
              <Mail className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              <span className="truncate text-[11px]">{trainer.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.04] pt-3.5">
          <button
            type="button"
            onClick={() => onAssign(trainer)}
            className="flex-1 rounded-xl border border-[#00BFFF]/20 bg-[#00BFFF]/10 py-2 text-center text-xs font-bold text-[#00BFFF] transition-all hover:border-transparent hover:bg-[#00BFFF] hover:text-black"
          >
            Assign Member
          </button>
          <button
            type="button"
            onClick={() => onEdit(trainer)}
            className="rounded-xl border border-white/5 bg-white/[0.01] p-2 text-xs text-gray-500 transition-colors hover:bg-[#39FF14]/10 hover:text-[#39FF14]"
            title="Edit Trainer"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(trainer)}
            disabled={isDeleting}
            className="rounded-xl border border-white/5 bg-white/[0.01] p-2 text-xs text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete Trainer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onCall(trainer.phone)}
            className="rounded-xl border border-white/5 bg-white/[0.01] p-2 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
            title="Call Trainer"
          >
            <Phone className="mr-1 inline h-3.5 w-3.5" />
            <span className="font-mono text-[10px]">{trainer.phone ? trainer.phone.slice(-10) : "No phone"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainersPage() {
  const [search, setSearch] = useState("");
  const trainersQuery = useUsers({ role: "Trainer", search: search.trim() || undefined });
  const membersQuery = useUsers({ role: "Member", include: "trainer" });
  const createUser = useCreateUser();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const { toast } = useToast();

  const trainers = useMemo(
    () => [...(trainersQuery.data?.users || [])].sort((a, b) => a.id - b.id),
    [trainersQuery.data?.users]
  );
  const members = useMemo(
    () => membersQuery.data?.users || [],
    [membersQuery.data?.users]
  );

  const [assigningToTrainer, setAssigningToTrainer] = useState<User | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<TrainerFormState>(defaultTrainerForm);
  const [editingTrainer, setEditingTrainer] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<TrainerFormState>(defaultTrainerForm);
  const [pendingDeleteTrainer, setPendingDeleteTrainer] = useState<User | null>(null);

  const availableMembers = useMemo(
    () => members.filter((member) => member.id !== assigningToTrainer?.id),
    [assigningToTrainer?.id, members]
  );

  const handleAssignSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!assigningToTrainer || !selectedMemberId) return;

    updateProfile.mutate(
      {
        id: Number(selectedMemberId),
        data: { trainerId: assigningToTrainer.id } as UpdateProfilePayload,
      },
      {
        onSuccess: () => {
          toast({ title: "Member assigned successfully" });
          setAssigningToTrainer(null);
          setSelectedMemberId("");
        },
        onError: (error) => toast({ title: "Error assigning member", description: error.message, variant: "destructive" }),
      },
    );
  };

  const handleCreateSubmit = (event: FormEvent) => {
    event.preventDefault();

    createUser.mutate({ ...trainerFormToPayload(addForm), role: "Trainer" }, {
      onSuccess: () => {
        toast({ title: "Trainer onboarded successfully" });
        setIsAddOpen(false);
        setAddForm(defaultTrainerForm);
      },
      onError: (error) => toast({ title: "Error onboarding trainer", description: error.message, variant: "destructive" }),
    });
  };

  const handleUpdateSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingTrainer) return;

    updateProfile.mutate(
      { id: editingTrainer.id, data: trainerFormToPayload(editForm) as UpdateProfilePayload },
      {
        onSuccess: () => {
          toast({ title: "Trainer updated successfully" });
          setEditingTrainer(null);
          setEditForm(defaultTrainerForm);
        },
        onError: (error) => toast({ title: "Error updating trainer", description: error.message, variant: "destructive" }),
      },
    );
  };

  const confirmDeleteTrainer = () => {
    if (!pendingDeleteTrainer) return;
    const trainer = pendingDeleteTrainer;

    deleteProfile.mutate(trainer.id, {
      onSuccess: () => {
        toast({ title: "Trainer deleted successfully" });
        if (editingTrainer?.id === trainer.id) setEditingTrainer(null);
        if (assigningToTrainer?.id === trainer.id) setAssigningToTrainer(null);
        setPendingDeleteTrainer(null);
      },
      onError: (error) => toast({ title: "Error deleting trainer", description: error.message, variant: "destructive" }),
    });
  };

  const openDialer = (phone: string) => {
    if (!phone.trim()) {
      toast({ title: "Phone number unavailable", variant: "destructive" });
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-6" id="trainer-directory">
      <div className="glass-card flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-white/5 p-5 shadow-xl md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, name, email, phone or timings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 font-sans text-xs text-white transition-all placeholder:text-gray-500 focus:border-[#00BFFF]/40 focus:outline-none"
            id="search-trainers"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black shadow-lg transition-all hover:shadow-[0_0_15px_rgba(0,191,255,0.4)] sm:self-auto"
          id="onboard-trainer-btn"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Onboard Trainer</span>
        </button>
      </div>

      {trainersQuery.isLoading || membersQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-2xl border border-white/5 bg-[#0b0b0b]" />
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b0b0b] p-8 text-center text-sm text-gray-400">
          No trainers onboarded for this gym yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {trainers.map((trainer, index) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              index={index}
              onAssign={(selectedTrainer) => {
                setAssigningToTrainer(selectedTrainer);
                setSelectedMemberId("");
              }}
              onEdit={(selectedTrainer) => {
                setEditingTrainer(selectedTrainer);
                setEditForm(trainerToForm(selectedTrainer));
                setEditingRole("Trainer");
              }}
              onDelete={setPendingDeleteTrainer}
              onCall={openDialer}
              isDeleting={deleteProfile.isPending}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {assigningToTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-[#00BFFF]/35 bg-[#090909] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Assign Member</h3>
                <button type="button" onClick={() => setAssigningToTrainer(null)} className="rounded bg-white/5 p-1 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-4 font-sans text-xs">
                <p className="text-xs leading-relaxed text-gray-400">
                  Select a member for{" "}
                  <span className="font-bold text-[#00BFFF]">{assigningToTrainer.name}</span>.
                </p>

                <div className="mt-3 space-y-1.5">
                  <label className="font-bold text-gray-400">Select Member *</label>
                  <select
                    required
                    value={selectedMemberId}
                    onChange={(event) => setSelectedMemberId(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-white focus:outline-none"
                  >
                    <option value="" className="bg-neutral-900">-- Choose member --</option>
                    {availableMembers.map((member) => (
                      <option key={member.id} value={member.id} className="bg-neutral-900">
                        {member.name} (#{member.id}){member.trainer?.name ? ` - Current: ${member.trainer.name}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setAssigningToTrainer(null)} className="rounded-xl border border-white/5 px-5 py-2.5 text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedMemberId || updateProfile.isPending}
                    className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black disabled:opacity-40"
                  >
                    {updateProfile.isPending ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-[#00BFFF]/35 bg-[#090909] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Onboard Trainer</h3>
                <button type="button" onClick={() => setIsAddOpen(false)} className="rounded bg-white/5 p-1 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 font-sans text-xs">
                <TrainerFormFields form={addForm} setForm={setAddForm} />

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-xl border border-white/5 px-5 py-2.5 text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={createUser.isPending} className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black disabled:opacity-40">
                    {createUser.isPending ? "Onboarding..." : "Onboard Trainer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-[#39FF14]/35 bg-[#090909] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Edit Trainer</h3>
                <button type="button" onClick={() => setEditingTrainer(null)} className="rounded bg-white/5 p-1 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4 font-sans text-xs">
                <TrainerFormFields form={editForm} setForm={setEditForm} />

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setEditingTrainer(null)} className="rounded-xl border border-white/5 px-5 py-2.5 text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateProfile.isPending} className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-6 py-2.5 font-black text-black disabled:opacity-40">
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDeleteTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#090909] text-white shadow-[0_0_55px_rgba(239,68,68,0.18)]"
            >
              <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_38%)] p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/25 bg-red-500/10 text-red-300">
                  <Trash2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">Delete Trainer?</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  This removes the trainer profile and clears current member assignments linked to this trainer.
                </p>
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                  <Avatar className="h-12 w-12 rounded-xl border border-white/10">
                    {pendingDeleteTrainer.photoUrl && <AvatarImage src={pendingDeleteTrainer.photoUrl} alt={pendingDeleteTrainer.name} className="object-cover" />}
                    <AvatarFallback className="rounded-xl bg-red-500/10 text-sm font-black text-red-300">{getInitials(pendingDeleteTrainer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{pendingDeleteTrainer.name}</p>
                    <p className="truncate font-mono text-[11px] text-gray-500">{pendingDeleteTrainer.email}</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPendingDeleteTrainer(null)}
                    disabled={deleteProfile.isPending}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs font-bold text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    Keep Trainer
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteTrainer}
                    disabled={deleteProfile.isPending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500 px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleteProfile.isPending ? "Deleting..." : "Delete Trainer"}
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
