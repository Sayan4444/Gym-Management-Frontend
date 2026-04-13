import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, GripVertical, Dumbbell } from "lucide-react";
import { useUsers } from "@/hooks/useApi";
import {
  useWorkoutPlans,
  useCreateWorkoutPlan,
  useUpdateWorkoutPlan,
  useDeleteWorkoutPlan,
} from "@/hooks/apis/useWorkoutPlan";
import { WorkoutPlan } from "@/data/types";

// ---------- Types ----------
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

// ---------- Exercise Row Editor ----------
function ExerciseList({
  exercises,
  onChange,
}: {
  exercises: ExerciseRow[];
  onChange: (rows: ExerciseRow[]) => void;
}) {
  const update = (idx: number, value: string) => {
    const next = [...exercises];
    next[idx] = { name: value };
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(exercises.filter((_, i) => i !== idx));
  };

  const add = () => onChange([...exercises, { name: "" }]);

  return (
    <div className="space-y-2">
      {exercises.map((ex, idx) => (
        <div key={idx} className="flex items-center gap-2 group">
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 opacity-50" />
          <Input
            placeholder={`e.g. 10 Push-ups X 3, 5 Pull-ups…`}
            value={ex.name}
            onChange={(e) => update(idx, e.target.value)}
            className="flex-1"
          />
          {exercises.length > 1 && (
            <button
              type="button"
              onClick={() => remove(idx)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full mt-1 border-dashed"
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Exercise
      </Button>
    </div>
  );
}

// ---------- Main Page ----------
export default function WorkoutPlansPage() {
  const { data: usersData } = useUsers({ include: "workout_plan" });
  const users = usersData?.users || [];

  const { data: plansData, isLoading } = useWorkoutPlans();
  const plans = plansData?.plans || [];

  const createMutation = useCreateWorkoutPlan();
  const updateMutation = useUpdateWorkoutPlan();
  const deleteMutation = useDeleteWorkoutPlan();

  // ---------- Delete confirmation state ----------
  const [deletingPlan, setDeletingPlan] = useState<WorkoutPlan | null>(null);

  const handleDeleteConfirm = () => {
    if (!deletingPlan) return;
    deleteMutation.mutate(deletingPlan.id, {
      onSuccess: () => setDeletingPlan(null),
    });
  };

  // O(1) lookup by user id
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  // Only members can be assigned a workout plan
  const members = useMemo(
    () => users.filter((u) => u.role === "Member"),
    [users]
  );

  // ---------- Dialog state ----------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyForm());

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
      exercises:
        plan.exercises && plan.exercises.length > 0
          ? plan.exercises.map((ex) => ({ name: ex.name }))
          : [{ name: "" }],
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = () => {
    const exercises = form.exercises.filter((ex) => ex.name.trim() !== "");

    if (editingPlan) {
      updateMutation.mutate({
        id: editingPlan.id,
        data: {
          title: form.title,
          exercises,
        },
      }, {
        onSuccess: () => handleClose()
      });
    } else {
      createMutation.mutate({
        member_id: Number(form.memberId),
        title: form.title,
        exercises,
      }, {
        onSuccess: () => handleClose()
      });
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Workout Plans</h1>
          <p className="text-muted-foreground">{plans.length} plans created</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading plans…</p>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <Dumbbell className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-lg font-medium">No workout plans yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Create Plan" to add the first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const member = userMap.get(plan.memberId);
            return (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">
                      {plan.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary">Active</Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(plan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingPlan(plan)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <span>Assigned to:</span>
                    <span className="font-medium text-foreground">
                      {member?.name || "Unknown"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {plan.exercises && plan.exercises.length > 0 ? (
                    <ul className="space-y-1.5">
                      {plan.exercises.map((ex, i) => (
                        <li
                          key={ex.id ?? i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          <span>{ex.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No exercises added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPlan} onOpenChange={() => setDeletingPlan(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Workout Plan?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">"{deletingPlan?.title}"</span> and all
            its exercises will be permanently deleted. This cannot be undone.
          </p>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingPlan(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Workout Plan" : "Create Workout Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="wp-title">Plan Title</Label>
              <Input
                id="wp-title"
                placeholder="e.g. Strength Builder – Week 1"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>

            {/* Member selector (only when creating) */}
            {!editingPlan && (
              <div className="space-y-1.5">
                <Label>Assign to Member</Label>
                <Select
                  value={form.memberId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, memberId: v }))
                  }
                >
                  <SelectTrigger id="wp-member">
                    <SelectValue placeholder="Select a member…" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Exercises */}
            <div className="space-y-1.5">
              <Label>Exercises</Label>
              <p className="text-xs text-muted-foreground">
                Add as many rows as you like. Each row is one exercise, set or
                instruction — e.g. <em>"5 Jumping Jacks"</em>,{" "}
                <em>"2 Pull-ups × 3 sets"</em>.
              </p>
              <ExerciseList
                exercises={form.exercises}
                onChange={(rows) => setForm((f) => ({ ...f, exercises: rows }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isBusy ||
                !form.title.trim() ||
                (!editingPlan && !form.memberId)
              }
            >
              {isBusy
                ? "Saving…"
                : editingPlan
                ? "Save Changes"
                : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
