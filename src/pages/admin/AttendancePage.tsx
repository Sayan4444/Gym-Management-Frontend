import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDetailsDialog } from "@/components/UserDetailsDialog";
import { Attendance, User } from "@/data/types";
import { useMarkManualAttendance, useMarkManualCheckout, useAttendance } from "@/hooks/apis/useAttendance";
import { useUsers } from "@/hooks/apis/useUser";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/lib/utils";

type AttendanceRecord = Attendance & { userName: string };

const EMPTY_ATTENDANCE_RECORDS: AttendanceRecord[] = [];
const EMPTY_MEMBERS: User[] = [];

function getInitials(name?: string) {
  return (name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getDuration(record: Attendance) {
  const timeIn = new Date(record.timeIn);
  const timeOut = record.timeOut ? new Date(record.timeOut) : null;
  if (!timeOut) return "In progress";
  return `${Math.max(0, Math.round((timeOut.getTime() - timeIn.getTime()) / 60000))} min`;
}

function getRecordStatus(record: Attendance) {
  return record.timeOut ? "Completed" : "Active";
}

function getTodayInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().split("T")[0];
}

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(getTodayInputValue);
  const [deskSearch, setDeskSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const deskInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const todayDate = getTodayInputValue();
  const attendanceQuery = useAttendance({ date: selectedDate, search: logSearch.trim() || undefined });
  const todayAttendanceQuery = useAttendance({ date: todayDate });
  const membersQuery = useUsers({ role: "Member", include: "subscription,trainer" });
  const dayRecords = attendanceQuery.data?.attendance ?? EMPTY_ATTENDANCE_RECORDS;
  const todayRecords = todayAttendanceQuery.data?.attendance ?? EMPTY_ATTENDANCE_RECORDS;
  const members = membersQuery.data?.users ?? EMPTY_MEMBERS;
  const markAttendance = useMarkManualAttendance();
  const markCheckout = useMarkManualCheckout();

  const checkedInUserIds = useMemo(() => new Set(todayRecords.map((record) => record.userId)), [todayRecords]);

  const lookupMembers = useMemo(() => {
    const query = deskSearch.trim().toLowerCase();
    if (!query) return [];

    return members
      .filter((member) => {
        if (checkedInUserIds.has(member.id)) return false;
        return (
          member.name?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.phone?.toLowerCase().includes(query) ||
          String(member.id).includes(query)
        );
      })
      .slice(0, 4);
  }, [checkedInUserIds, deskSearch, members]);

  useEffect(() => {
    if (searchParams.get("action") !== "manual-checkin") return;

    deskInputRef.current?.focus();
    setSearchParams({ tab: "attendance" }, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleManualCheckIn = (member: User) => {
    markAttendance.mutate(
      { userId: member.id },
      {
        onSuccess: () => {
          toast({ title: `${member.name} checked in` });
          setDeskSearch("");
        },
        onError: (error) => toast({ title: "Error marking attendance", description: error.message, variant: "destructive" }),
      },
    );
  };

  const handleManualCheckout = (record: Attendance & { userName: string }) => {
    markCheckout.mutate(
      { userId: record.userId },
      {
        onSuccess: () => toast({ title: `${record.userName || "Member"} checked out` }),
        onError: (error) => toast({ title: "Error marking checkout", description: error.message, variant: "destructive" }),
      },
    );
  };

  return (
    <div className="space-y-6" id="attendance-panel">
      <div className="space-y-6">
        <div className="glass-card relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-2xl">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00BFFF] to-[#39FF14]" />

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39FF14] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#39FF14]" />
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Manual Check-in</h4>
            </div>

            <p className="text-xs leading-relaxed text-gray-400">
              Perform instant manual check-ins for today&apos;s register. Type the members&apos; name, mobile number, email, or ID in the live search deck.
            </p>

            <div className="relative mt-5">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={deskInputRef}
                type="text"
                placeholder="Lookup Name, ID, Email, or Phone..."
                value={deskSearch}
                onChange={(event) => setDeskSearch(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 pl-10 pr-4 text-xs text-white transition-colors placeholder:text-gray-500 focus:border-[#39FF14] focus:outline-none"
                id="reception-search-input"
              />
            </div>

            <div className="mt-4 space-y-2">
              {lookupMembers.length > 0 ? (
                lookupMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 hover:border-[#39FF14]/30 hover:bg-white/[0.03]"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0 rounded-lg border border-white/10">
                        {member.photoUrl && <AvatarImage src={member.photoUrl} alt={member.name} className="object-cover" />}
                        <AvatarFallback className="rounded-lg bg-[#00BFFF]/10 text-[11px] font-bold text-[#00BFFF]">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-white">{member.name}</p>
                        <p className="font-mono text-[9px] text-[#00BFFF]">#{member.id}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleManualCheckIn(member)}
                      disabled={markAttendance.isPending}
                      className="shrink-0 rounded-lg bg-[#39FF14] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black hover:shadow-[0_0_10px_rgba(57,255,20,0.5)] disabled:opacity-50"
                    >
                      Check-In
                    </button>
                  </motion.div>
                ))
              ) : deskSearch.trim() !== "" ? (
                <p className="py-4 text-center text-[11px] italic text-gray-500">
                  {todayAttendanceQuery.isLoading ? "Checking today's register..." : "No matching athletes ready for check-in."}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-6 shadow-2xl">
          <div className="mb-4 flex flex-col gap-4 border-b border-white/[0.04] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Check-In Register</h4>
              <p className="font-mono mt-0.5 text-xs text-gray-500">Attendance logs for the selected date</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.01] py-1.5 pl-9 pr-3 font-mono text-[11px] text-white focus:border-[#00BFFF]/40 focus:outline-none sm:w-40"
                  id="attendance-date-filter"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by athlete name..."
                  value={logSearch}
                  onChange={(event) => setLogSearch(event.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.01] py-1.5 pl-9 pr-3 text-[11px] text-white focus:border-[#00BFFF]/40 focus:outline-none sm:w-64"
                  id="attendance-name-filter"
                />
              </div>
            </div>
          </div>

          <div className="max-h-[430px] overflow-y-auto pr-1">
            <table className="w-full table-fixed text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <th className="w-[26%] px-3 py-2.5">Athlete</th>
                  <th className="w-[12%] px-3 py-2.5 font-mono">Date</th>
                  <th className="w-[11%] px-3 py-2.5">Method</th>
                  <th className="w-[13%] px-3 py-2.5 font-mono">Log In Time</th>
                  <th className="w-[13%] px-3 py-2.5 font-mono">Logout Time</th>
                  <th className="w-[10%] px-3 py-2.5 font-mono">Duration</th>
                  <th className="w-[8%] px-3 py-2.5">Status</th>
                  <th className="w-[7%] px-3 py-2.5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {dayRecords.map((record: Attendance & { userName: string }) => {
                  const user = record.user || members.find((member) => member.id === record.userId);
                  const status = getRecordStatus(record);

                  return (
                    <tr key={record.id} className="hover:bg-white/[0.01]">
                      <td className="flex min-w-0 items-center gap-3 px-3 py-3">
                        <Avatar className="h-8 w-8 rounded-lg border border-white/10">
                          {user?.photoUrl && <AvatarImage src={user.photoUrl} alt={record.userName} className="object-cover" />}
                          <AvatarFallback className="rounded-lg bg-[#00BFFF]/10 text-[11px] font-bold text-[#00BFFF]">
                            {getInitials(record.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <button type="button" onClick={() => user && setSelectedUser(user)} className="min-w-0 text-left">
                          <p className="truncate font-bold text-white hover:text-[#00BFFF]">{record.userName || "Unknown"}</p>
                          <p className="truncate font-mono text-[9px] text-[#00BFFF]">#{record.userId}</p>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-[10px] text-gray-400">{formatDate(record.date)}</td>
                      <td className="px-3 py-3">
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase text-gray-300">
                          {record.source || "Unknown"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono font-bold text-gray-200">
                        {formatTime(record.timeIn)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono font-bold text-gray-200">
                        {record.timeOut ? formatTime(record.timeOut) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-gray-400">{getDuration(record)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                            status === "Active" ? "bg-[#39FF14]/10 text-[#39FF14]" : "bg-[#00BFFF]/10 text-[#00BFFF]"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {!record.timeOut && (
                          <button
                            type="button"
                            onClick={() => handleManualCheckout(record)}
                            disabled={markCheckout.isPending}
                            className="rounded-lg border border-[#00BFFF]/20 bg-[#00BFFF]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#00BFFF] transition-all hover:bg-[#00BFFF] hover:text-black disabled:opacity-50"
                          >
                            Check-Out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {dayRecords.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-xs text-gray-500">
                      {attendanceQuery.isLoading ? "Loading attendance records..." : "No attendance records for this date."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserDetailsDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
}
