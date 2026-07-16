import { useMemo, useState } from "react";
import { CalendarCheck, Clock, Timer } from "lucide-react";

import { PaginationFooter } from "@/components/PaginationFooter";
import { useAttendance } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

function sourceClass(source: string) {
  if (source === "Biometric") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (source === "Manual") return "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]";
  return "border-white/10 bg-white/5 text-gray-300";
}

export default function MemberAttendanceHistory({ userId }: { userId?: number }) {
  const attendanceData = useAttendance(userId ? { user_id: userId } : undefined).data;
  const attendance = useMemo(() => attendanceData?.attendance ?? [], [attendanceData?.attendance]);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(attendance.length / ITEMS_PER_PAGE);
  const pagedAttendance = attendance.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const completed = attendance.filter((item) => item.timeOut);
    const totalMinutes = completed.reduce((sum, item) => {
      const timeIn = new Date(item.timeIn).getTime();
      const timeOut = item.timeOut ? new Date(item.timeOut).getTime() : timeIn;
      return sum + Math.max(0, Math.round((timeOut - timeIn) / 60000));
    }, 0);
    const latest = attendance[0];

    return {
      totalCheckIns: attendance.length,
      avgMinutes: completed.length ? Math.round(totalMinutes / completed.length) : 0,
      latest: latest ? formatDate(latest.date) : "-",
    };
  }, [attendance]);

  return (
    <div className="space-y-6" id="member-attendance-panel">
      <div className="glass-card rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#00BFFF]/5 p-5">
        <h1 className="text-xl font-black uppercase tracking-tight text-white">Attendance History</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { label: "Total Check-ins", value: stats.totalCheckIns, icon: CalendarCheck, color: "text-[#39FF14]" },
          { label: "Avg Duration", value: `${stats.avgMinutes}m`, icon: Timer, color: "text-amber-400" },
          { label: "Latest Visit", value: stats.latest, icon: Clock, color: "text-purple-300" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">{item.label}</span>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className="font-mono text-xl font-black text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-4">Date</th>
                <th className="p-4">Time In</th>
                <th className="p-4">Time Out</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {pagedAttendance.map((item) => {
                const timeIn = new Date(item.timeIn);
                const timeOut = item.timeOut ? new Date(item.timeOut) : null;
                const duration = timeOut ? `${Math.round((timeOut.getTime() - timeIn.getTime()) / 60000)} min` : "-";

                return (
                  <tr key={item.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">{formatDate(item.date)}</td>
                    <td className="p-4 font-mono text-gray-300">{formatTime(timeIn)}</td>
                    <td className="p-4 font-mono text-gray-400">{timeOut ? formatTime(timeOut) : "-"}</td>
                    <td className="p-4 font-mono text-gray-400">{duration}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${sourceClass(item.source)}`}>
                        {item.source}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {pagedAttendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {attendance.length > 0 && (
          <div className="border-t border-white/5 px-4 py-3">
            <PaginationFooter page={page} totalPages={totalPages} setPage={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={attendance.length} itemName="records" />
          </div>
        )}
      </div>
    </div>
  );
}
