import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";
import { PaginationFooter } from "@/components/PaginationFooter";

const ITEMS_PER_PAGE = 10;

export default function MemberAttendanceHistory() {
  const { data: attendanceData } = useAttendance();
  const attendance = attendanceData?.attendance || [];

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(attendance.length / ITEMS_PER_PAGE);
  const pagedAttendance = attendance.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
              {pagedAttendance.map((a) => {
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
          <PaginationFooter
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={attendance.length}
            itemName="records"
          />
        </CardContent>
      </Card>
    </div>
  );
}
