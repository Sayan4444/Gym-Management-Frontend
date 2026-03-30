import { fetchApi } from './core';

export const membershipApi = {
  // ----- Membership Routes -----
  getMembershipPlansByGym: (gymId: number | string) => fetchApi(`/gyms/${gymId}/memberships`),
  getMembershipPlans: () => fetchApi("/memberships"),
  createMembershipPlan: (gymId: number | string, data: any) => fetchApi(`/gyms/${gymId}/memberships`, { method: "POST", body: JSON.stringify(data) }),
  updateMembershipPlan: (gymId: number | string, membershipId: number | string, data: any) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMembershipPlan: (gymId: number | string, membershipId: number | string) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "DELETE" }),
};
