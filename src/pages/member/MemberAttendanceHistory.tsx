import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";

export default function MemberAttendanceHistory() {
  const { data: attendanceData } = useAttendance();
  const attendance = attendanceData?.attendance || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Attendance History</h1>
        <p className="text-muted-foreground">{attendance.length} total check-ins</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a) => {
                const timeIn = new Date(a.timeIn);
                const timeOut = a.timeOut ? new Date(a.timeOut) : null;
                const duration = timeOut ? `${Math.round((timeOut.getTime() - timeIn.getTime()) / 60000)} min` : "—";
                return (
                  <TableRow key={a.id}>
                    <TableCell>{formatDate(a.date)}</TableCell>
                    <TableCell>{formatTime(timeIn)}</TableCell>
                    <TableCell>{timeOut ? formatTime(timeOut) : "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{duration}</TableCell>
                    <TableCell><Badge variant={a.source === "Biometric" ? "default" : "secondary"}>{a.source}</Badge></TableCell>
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
