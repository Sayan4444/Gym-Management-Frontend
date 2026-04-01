import { fetchApi } from './core';

export const dashboardStatsApi = {
  getSuperAdminDashboardStats: () => fetchApi('/dashboard/superadmin'),
  getAdminDashboardStats: () => fetchApi('/dashboard/gymadmin'),
};
