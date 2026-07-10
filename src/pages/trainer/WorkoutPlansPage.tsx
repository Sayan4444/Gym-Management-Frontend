import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, GripVertical, Pencil, Plus, Search, Trash2, Users } from "lucide-react";

import { WorkoutPlan } from "@/data/types";
import { useUsers } from "@/hooks/useApi";
import { useCreateWorkoutPlan, useDeleteWorkoutPlan, useUpdateWorkoutPlan, useWorkoutPlans } from "@/hooks/apis/useWorkoutPlan";

interface ExerciseRow {
  name: string;
}

interface PlanFormState {
  title: string;
  memberId: string;
  exercises: ExerciseRow[];
}

const emptyForm = (): PlanFormState => ({
  title: "",
  memberId: "",
  exercises: [{ name: "" }],
});

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-[#00BFFF]/60 focus:outline-none";

function ExerciseList({ exercises, onChange }: { exercises: ExerciseRow[]; onChange: (rows: ExerciseRow[]) => void }) {
  const update = (index: number, value: string) => {
    const next = [...exercises];
    next[index] = { name: value };
    onChange(next);
  };

  const remove = (index: number) => onChange(exercises.filter((_, itemIndex) => itemIndex !== index));
  const add = () => onChange([...exercises, { name: "" }]);

  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div key={index} className="group flex items-center gap-2">
          <GripVertical className="h-4 w-4 shrink-0 text-gray-600" />
          <input
            placeholder="e.g. 10 Push-ups x 3 sets"
            value={exercise.name}
            onChange={(event) => update(index, event.target.value)}
            className={inputClass}
          />
          {exercises.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-lg border border-red-500/10 bg-red-500/10 p-2 text-red-400 opacity-100 transition-colors hover:bg-red-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Remove exercise"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#00BFFF]/25 px-3 py-2.5 text-xs font-bold text-[#00BFFF] transition-colors hover:bg-[#00BFFF]/10"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Exercise
      </button>
    </div>
  );
}

export default function WorkoutPlansPage() {
  const users = useUsers({ include: "workout_plan" }).data?.users || [];
  const { data: plansData, isLoading } = useWorkoutPlans();
  const plans = plansData?.plans || [];

  const createMutation = useCreateWorkoutPlan();
  const updateMutation = useUpdateWorkoutPlan();
  const deleteMutation = useDeleteWorkoutPlan();

  const [search, setSearch] = useState("");
  const [deletingPlan, setDeletingPlan] = useState<WorkoutPlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyForm());

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const members = useMemo(() => users.filter((user) => user.role === "Member"), [users]);
  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return plans;

    return plans.filter((plan) => {
      const member = userMap.get(plan.memberId);
      return [plan.title, member?.name, plan.exercises?.map((exercise) => exercise.name).join(" ")].join(" ").toLowerCase().includes(query);
    });
  }, [plans, search, userMap]);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setForm({
      title: plan.title,
      memberId: String(plan.memberId),
      exercises: plan.exercises?.length ? plan.exercises.map((exercise) => ({ name: exercise.name })) : [{ name: "" }],
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = () => {
    const exercises = form.exercises.filter((exercise) => exercise.name.trim() !== "");

    if (editingPlan) {
      updateMutation.mutate(
        {
          id: editingPlan.id,
          data: {
            title: form.title,
            exercises,
          },
        },
        { onSuccess: handleClose },
      );
      return;
    }

    createMutation.mutate(
      {
        member_id: Number(form.memberId),
        title: form.title,
        exercises,
      },
      { onSuccess: handleClose },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingPlan) return;
    deleteMutation.mutate(deletingPlan.id, { onSuccess: () => setDeletingPlan(null) });
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6" id="trainer-workouts-panel">
      <div className="glass-card flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#39FF14]/5 p-5 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Training Blueprint Console</span>
          <h1 className="mt-1 text-xl font-black uppercase tracking-tight text-white">Workout Plans</h1>
          <p className="mt-1 text-xs text-gray-400">{plans.length} plans created for assigned members</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black transition-opacity hover:opacity-90"
          id="create-workout-plan-btn"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { label: "Active Programs", value: plans.length, icon: Dumbbell, color: "text-[#00BFFF]" },
          { label: "Assigned Members", value: new Set(plans.map((plan) => plan.memberId)).size, icon: Users, color: "text-[#39FF14]" },
          { label: "Exercise Blocks", value: plans.reduce((sum, plan) => sum + (plan.exercises?.length || 0), 0), icon: GripVertical, color: "text-amber-400" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">{item.label}</span>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className="font-mono text-2xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-5 shadow-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by member, plan title, or exercise..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-[#00BFFF]/50 focus:outline-none"
            id="workout-plan-search"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center text-xs text-gray-500">Loading workout plans...</div>
      ) : filteredPlans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <Dumbbell className="mx-auto mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm font-bold text-white">No workout plans found</p>
          <p className="mt-1 text-xs text-gray-500">Create the first member training blueprint from the button above.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPlans.map((plan) => {
            const member = userMap.get(plan.memberId);
            return (
              <div key={plan.id} className="glass-card flex flex-col rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#39FF14]">Program #{plan.id}</p>
                    <h3 className="mt-1 truncate text-base font-black uppercase tracking-tight text-white">{plan.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Assigned to <span className="font-bold text-gray-300">{member?.name || "Unknown"}</span>
                    </p>
                  </div>
                  <span className="rounded-full border border-[#39FF14]/20 bg-[#39FF14]/10 px-2.5 py-1 font-mono text-[9px] font-black uppercase text-[#39FF14]">
                    Active
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  {plan.exercises?.length ? (
                    plan.exercises.map((exercise, index) => (
                      <div key={exercise.id ?? index} className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-gray-300">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00BFFF]" />
                        <span>{exercise.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3 text-xs italic text-gray-500">No exercises added yet.</p>
                  )}
                </div>

                <div className="mt-5 flex justify-end gap-2 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(plan)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#00BFFF]/20 px-3 py-2 text-xs font-bold text-[#00BFFF] transition-colors hover:bg-[#00BFFF]/10"
                    title="Edit Workout Plan"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingPlan(plan)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                    title="Delete Workout Plan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(deletingPlan)} onOpenChange={(open) => !open && setDeletingPlan(null)}>
        <DialogContent className="border-red-500/20 bg-[#090909] text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-tight">Delete Workout Plan?</DialogTitle>
            <DialogDescription className="text-gray-500">Confirm removal of this workout blueprint and its exercise rows.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-red-500/10 bg-red-500/10 p-4 text-sm text-gray-300">
            <p>
              <span className="font-bold text-white">{deletingPlan?.title}</span> and all of its exercise blocks will be permanently deleted.
            </p>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeletingPlan(null)}
              disabled={deleteMutation.isPending}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : handleClose())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#00BFFF]/20 bg-[#090909] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-tight">{editingPlan ? "Edit Workout Plan" : "Create Workout Plan"}</DialogTitle>
            <DialogDescription className="text-gray-500">Build or update the member workout instructions saved through the existing workout API.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400" htmlFor="wp-title">
                Plan Title
              </label>
              <input
                id="wp-title"
                placeholder="e.g. Strength Builder - Week 1"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className={inputClass}
              />
            </div>

            {!editingPlan && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Assign to Member</label>
                <Select value={form.memberId} onValueChange={(value) => setForm((current) => ({ ...current, memberId: value }))}>
                  <SelectTrigger id="wp-member" className="border-white/10 bg-[#111] text-white">
                    <SelectValue placeholder="Select a member..." />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#111] text-white">
                    {members.map((member) => (
                      <SelectItem key={member.id} value={String(member.id)}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400">Exercises</label>
              <p className="text-xs text-gray-500">Each row is one exercise, set, or instruction.</p>
              <ExerciseList exercises={form.exercises} onChange={(rows) => setForm((current) => ({ ...current, exercises: rows }))} />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy || !form.title.trim() || (!editingPlan && !form.memberId)}
              className="rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2 text-xs font-black text-black disabled:opacity-50"
            >
              {isBusy ? "Saving..." : editingPlan ? "Save Changes" : "Create Plan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
