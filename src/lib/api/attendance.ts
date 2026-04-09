import { fetchApi } from './core';
import type { ScanQRAttendancePayload } from '@/hooks/apis/useAttendance';

export const attendanceApi = {
  // ----- Attendance Routes -----
  getQRToken: () => fetchApi("/attendance/qr"),
  scanQRAttendance: (data: ScanQRAttendancePayload) => fetchApi("/attendance/qr/scan", { method: "POST", body: JSON.stringify(data) }),
  markManualAttendance: (userId: number) => fetchApi(`/attendance/${userId}`, { method: "POST"}),
  getAttendance: (params?: { date?: string; user_id?: number; gym_id?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.date) qs.append("date", params.date);
    if (params?.user_id) qs.append("user_id", params.user_id.toString());
    if (params?.gym_id) qs.append("gym_id", params.gym_id.toString());
    if (params?.search) qs.append("search", params.search);
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return fetchApi(`/attendance${query}`);
  },
};
