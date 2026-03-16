import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarCheck, Plus, Crown } from "lucide-react";
import { useUsers, useSubscriptions, usePlans } from "@/hooks/useApi";

// Local static data for attendance records
const attendanceRecords = [
  { id: 1, userId: 7, date: new Date().toISOString().split("T")[0], timeIn: new Date().toISOString(), timeOut: null, source: "Biometric" }
];

export default function AttendancePage() {
  const gymId = 1;
  const { data: users = [] } = useUsers(gymId);
  const { data: subscriptions = [] } = useSubscriptions(gymId);
  const { data: plans = [] } = usePlans(gymId);

  const gymMembers = users.filter(u => u.role === "Member");
  const memberIds = new Set(gymMembers.map((m) => m.id));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const dayRecords = attendanceRecords
    .filter(a => a.date === selectedDate && memberIds.has(a.userId))
    .sort((a, b) => new Date(a.timeIn).getTime() - new Date(b.timeIn).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Attendance</h1>
          <p className="text-muted-foreground">{dayRecords.length} check-ins on {selectedDate}</p>
        </div>
        <div className="flex gap-3">
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
          <Button><Plus className="mr-2 h-4 w-4" /> Manual Check-in</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayRecords.map((a) => {
                const user = users.find((u) => u.id === a.userId);
                const sub = subscriptions.find((s) => s.userId === a.userId && s.status === "Active");
                const plan = sub ? plans.find((p) => p.id === sub.planId) : null;
                const isPremium = plan?.name.toLowerCase().includes("premium");
                const timeIn = new Date(a.timeIn);
                const timeOut = a.timeOut ? new Date(a.timeOut) : null;
                const duration = timeOut ? `${Math.round((timeOut.getTime() - timeIn.getTime()) / 60000)} min` : "In progress";
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user?.name.split(" ").map(n => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {isPremium && (
                            <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-400 drop-shadow" />
                          )}
                        </div>
                        <span className="font-medium">{user?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{timeIn.toLocaleTimeString()}</TableCell>
                    <TableCell>{timeOut ? timeOut.toLocaleTimeString() : <Badge variant="outline" className="bg-success/10 text-success">Active</Badge>}</TableCell>
                    <TableCell className="text-muted-foreground">{duration}</TableCell>
                    <TableCell>
                      <Badge variant={a.source === "Biometric" ? "default" : "secondary"}>{a.source}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {dayRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No attendance records for this date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
