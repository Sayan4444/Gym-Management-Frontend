import { fetchApi } from './core';

export const attendanceApi = {
  // ----- Attendance Routes -----
  getQRToken: () => fetchApi("/attendance/qr"),
  scanQRAttendance: (data: any) => fetchApi("/attendance/qr/scan", { method: "POST", body: JSON.stringify(data) }),
  markManualAttendance: (userId: number | string, data: any) => fetchApi(`/attendance/${userId}`, { method: "POST", body: JSON.stringify(data) }),
};
