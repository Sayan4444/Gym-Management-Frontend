import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, QrCode } from "lucide-react";

import { useAttendance } from "@/hooks/apis/useAttendance";
import { useUsers } from "@/hooks/apis/useUser";
import { User } from "@/data/types";
import { UserDetailsDialog } from "@/components/UserDetailsDialog";
import { PaginationFooter } from "@/components/PaginationFooter";
import { QRCodeModal } from "@/components/QRCodeModal";
import { ManualCheckInModal } from "@/components/ManualCheckInModal";
import { formatDate, formatTime } from "@/lib/utils";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const dayRecords = useAttendance({ date: selectedDate }).data?.attendance || [];
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dayRecords.length / itemsPerPage) || 1;
  const paginatedRecords = dayRecords.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Attendance</h1>
          <p className="text-muted-foreground">{dayRecords?.length} check-ins on {formatDate(selectedDate)}</p>
        </div>
        <div className="flex gap-3 items-center">
          <Input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }} className="w-44" />

          {/* Get QR Button + Modal */}
          <Button variant="outline" onClick={() => setIsQRModalOpen(true)}>
            <QrCode className="mr-2 h-4 w-4" /> Get QR
          </Button>
          <QRCodeModal open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
          <Button onClick={() => setIsManualModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Manual Check-in
          </Button>
          <ManualCheckInModal open={isManualModalOpen} onOpenChange={setIsManualModalOpen} />
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
              {paginatedRecords.map((a: any) => {
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
                              {a.userName?.split(" ").map((n: string) => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span 
                          className="font-medium cursor-pointer hover:underline text-primary" 
                          onClick={() => {
                            const user = users.find((u: any) => u.id === a.userId);
                            if (user) setSelectedUser(user as User);
                          }}
                        >
                          {a.userName || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(timeIn)}</TableCell>
                    <TableCell>{timeOut ? formatTime(timeOut) : <Badge variant="outline" className="bg-success/10 text-success">Active</Badge>}</TableCell>
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

          <PaginationFooter
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            totalItems={dayRecords.length}
            itemName="check-ins"
          />
        </CardContent>
      </Card>

      <UserDetailsDialog 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />
    </div>
  );
}
