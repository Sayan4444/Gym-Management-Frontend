import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMe, useUsers, useAttendance } from "@/hooks/useApi";
import { Dumbbell, UserCheck, Users } from "lucide-react";

export default function TrainerDashboard() {
  const me = useMe().data;

  const assignedMembers = useUsers({ include: "workout_plan" }).data?.users || [];

  const workouts = assignedMembers.flatMap((m) => m.workoutPlans || []);
  const todayStr = new Date().toISOString().split('T')[0]; 
  const todayAttendance = useAttendance({ date: todayStr }).data?.attendance || [];
  // TODO: Replace static trend badges with trainer-specific backend metrics.
  const kpiCards = [
    { title: "Assigned Members", value: assignedMembers.length, badge: "+12%", icon: Users, color: "text-[#00BFFF]" },
    { title: "Present Today", value: todayAttendance.length, badge: "+14%", icon: UserCheck, color: "text-[#39FF14]" },
    { title: "Workout Programs", value: workouts.length, badge: "+4", icon: Dumbbell, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl border border-white/5 bg-[#111111]/50 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.title}</p>
                <span className="rounded bg-[#39FF14]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#39FF14]">{card.badge}</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-mono text-2xl font-bold tracking-tight text-white">{card.value}</p>
                <div className={`rounded-lg bg-white/[0.02] p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="glass-card rounded-2xl border-white/5 bg-transparent text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">My Members</CardTitle>
          <p className="font-mono text-xs text-gray-500">Welcome, {me?.name?.split(" ")[0] || "Trainer"}</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-500">Name</TableHead>
                <TableHead className="text-gray-500">Email</TableHead>
                <TableHead className="text-gray-500">Biometric</TableHead>
                <TableHead className="text-gray-500">Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedMembers.map((m) => {
                const present = todayAttendance.some(a => a.userId === m.id);
                return (
                  <TableRow key={m.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          {m.photoUrl && <AvatarImage src={m.photoUrl} alt={m.name} className="object-cover" />}
                          <AvatarFallback className="bg-[#00BFFF]/10 text-[#00BFFF] text-xs">{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{m.email}</TableCell>
                    <TableCell>
                      <Badge variant={m.biometricId ? "default" : "outline"} className="text-xs">{m.biometricId ? "Enrolled" : "Not Set"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={present ? "border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]" : "border-white/10 text-gray-400"}>{present ? "Present" : "Absent"}</Badge>
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
