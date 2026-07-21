import { fetchApi, API_BASE_URL } from './api/core';
import { authApi } from './api/auth';
import { gymApi } from './api/gym';
import { membershipApi } from './api/membership';
import { userApi } from './api/user';
import { subscriptionApi } from './api/subscription';
import { paymentApi } from './api/payment';
import { addonApi } from './api/addon';
import { userAddonApi } from './api/userAddon';
import { workoutPlanApi } from './api/workoutplan';
import { attendanceApi } from './api/attendance';
import { dashboardStatsApi } from './api/DashboardStats';
import { bookDemoApi } from './api/bookDemo';
import { reviewApi } from './api/review';
import { notificationApi } from './api/notification';
import { consultationApi } from './api/consultation';
import { biometricDeviceApi } from './api/biometricDevice';

export { fetchApi, API_BASE_URL };

export const api = {
  ...authApi,
  ...gymApi,
  ...membershipApi,
  ...userApi,
  ...subscriptionApi,
  ...paymentApi,
  ...addonApi,
  ...userAddonApi,
  ...workoutPlanApi,
  ...attendanceApi,
  ...dashboardStatsApi,
  ...bookDemoApi,
  ...reviewApi,
  ...notificationApi,
  ...consultationApi,
  ...biometricDeviceApi,
};
