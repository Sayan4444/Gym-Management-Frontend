import { fetchApi, API_BASE_URL } from './api/core';
import { authApi } from './api/auth';
import { gymApi } from './api/gym';
import { membershipApi } from './api/membership';
import { userApi } from './api/user';
import { subscriptionApi } from './api/subscription';
import { paymentApi } from './api/payment';
import { addonApi } from './api/addon';
import { workoutPlanApi } from './api/workoutplan';
import { attendanceApi } from './api/attendance';

export { fetchApi, API_BASE_URL };

export const api = {
  ...authApi,
  ...gymApi,
  ...membershipApi,
  ...userApi,
  ...subscriptionApi,
  ...paymentApi,
  ...addonApi,
  ...workoutPlanApi,
  ...attendanceApi,

  // ----- Legacy/Other Routes (kept to prevent breaking existing code) -----
  submitDemoRequest: (data: {
    fullName: string;
    mobile: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  }) => fetchApi("/demo-request", { method: "POST", body: JSON.stringify(data) }),
  logAttendance: (data: any) => fetchApi("/attendance", { method: "POST", body: JSON.stringify(data) }),
};
