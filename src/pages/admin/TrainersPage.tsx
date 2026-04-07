import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { PaginationFooter } from "@/components/PaginationFooter";
import { useUsers } from "@/hooks/useApi";
import { User } from "@/data/types";

// Separate component so useUsers can be called at its top level (Rules of Hooks).
// Only the cards currently rendered (one page = 6 trainers) fire requests,
// so we never pull all members at once regardless of how many users exist.
function TrainerCard({ trainer }: { trainer: User }) {
  const members = useUsers({ role: "Member", trainerId: trainer.id }).data?.users || [];
  
  const plans = members.map((member) => member.workoutPlan)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary text-primary-foreground font-display">
              {trainer.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{trainer.name}</h3>
            <p className="text-sm text-muted-foreground">{trainer.email}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="text-center flex-1 p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold font-display">{members.length}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div className="text-center flex-1 p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold font-display">{plans.length}</p>
            <p className="text-xs text-muted-foreground">Workout Plans</p>
          </div>
        </div>
        <div className="mt-3">
          <Badge variant={trainer.biometricId ? "default" : "outline"} className="text-xs">
            {trainer.biometricId ? "Biometric Enrolled" : "No Biometric"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TrainersPage() {
  const trainersData = useUsers({ role: "Trainer", include: "workout_plan" }).data?.users || [];

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(trainersData.length / itemsPerPage) || 1;
  const trainers = trainersData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Trainers</h1>
        <p className="text-muted-foreground">{trainersData.length} trainers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => (
          <TrainerCard key={t.id} trainer={t} />
        ))}
      </div>

      <PaginationFooter
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        totalItems={trainersData.length}
        itemName="trainers"
        className="pt-4 pb-8"
      />
    </div>
  );
}
