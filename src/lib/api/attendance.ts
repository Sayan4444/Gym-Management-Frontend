import { fetchApi } from './core';

export const attendanceApi = {
  // ----- Attendance Routes -----
  getQRToken: () => fetchApi("/attendance/qr"),
  scanQRAttendance: (data: { scannedToken: string }) => fetchApi("/attendance/qr/scan", { method: "POST", body: JSON.stringify(data) }),
  markManualAttendance: (userId: number) => fetchApi(`/attendance/${userId}`, { method: "POST"}),
};
