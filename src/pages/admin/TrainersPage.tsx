import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTrainersByGym, users, workoutPlans } from "@/data/dummy";

const trainers = getTrainersByGym(1);

export default function TrainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Trainers</h1>
        <p className="text-muted-foreground">{trainers.length} trainers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((t) => {
          const assignedMembers = users.filter(u => u.trainerId === t.id);
          const plans = workoutPlans.filter(w => w.trainerId === t.id);
          return (
            <Card key={t.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-primary-foreground font-display">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.email}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="text-center flex-1 p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-display">{assignedMembers.length}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center flex-1 p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold font-display">{plans.length}</p>
                    <p className="text-xs text-muted-foreground">Workout Plans</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant={t.biometricId ? "default" : "outline"} className="text-xs">
                    {t.biometricId ? "Biometric Enrolled" : "No Biometric"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
