import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import { users, attendanceRecords, getWorkoutPlansByTrainer } from "@/data/dummy";
import WorkoutPlansPage from "./WorkoutPlansPage";

const trainer = users.find(u => u.id === 4)!;
const assignedMembers = users.filter(u => u.trainerId === trainer.id);
const workouts = getWorkoutPlansByTrainer(trainer.id);
const today = new Date().toISOString().split("T")[0];
const todayAttendance = attendanceRecords.filter(a => a.date === today && assignedMembers.some(m => m.id === a.userId));

export default function TrainerDashboard() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  if (currentTab === "workouts") {
    return <WorkoutPlansPage />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Welcome, {trainer.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Your trainer dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display text-primary">{assignedMembers.length}</p>
            <p className="text-sm text-muted-foreground">Assigned Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display text-success">{todayAttendance.length}</p>
            <p className="text-sm text-muted-foreground">Present Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold font-display">{workouts.length}</p>
            <p className="text-sm text-muted-foreground">Workout Plans</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>My Members</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Biometric</TableHead>
                <TableHead>Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedMembers.map((m) => {
                const present = todayAttendance.some(a => a.userId === m.id);
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.email}</TableCell>
                    <TableCell>
                      <Badge variant={m.biometricId ? "default" : "outline"} className="text-xs">{m.biometricId ? "Enrolled" : "Not Set"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={present ? "bg-success/10 text-success" : ""}>{present ? "Present" : "Absent"}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
