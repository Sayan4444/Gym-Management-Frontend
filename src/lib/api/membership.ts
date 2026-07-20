import { MembershipPlan } from '../../data/types';
import { UpdateMembershipPayload } from '../../hooks/apis/useMembership';
import { fetchApi } from './core';

export const membershipApi = {
  // ----- Membership Routes -----
  // A public route to fetch the memberships offered by gym
  getMembershipPlansByGym: (gymId: number ) => fetchApi(`/gyms/${gymId}/memberships`),
  // An authenticated route hit by loggedin user
  getMembershipPlans: (gymId?: number) => fetchApi(gymId ? `/memberships?gym_id=${gymId}` : "/memberships"),
  createMembershipPlan: (data: MembershipPlan) => fetchApi("/gyms/memberships", { method: "POST", body: JSON.stringify(data) }),
  updateMembershipPlan: (membershipId: number, data: UpdateMembershipPayload) => fetchApi(`/gyms/memberships/${membershipId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMembershipPlan: (membershipId: number) => fetchApi(`/gyms/memberships/${membershipId}`, { method: "DELETE" }),

  // ----- Plan Addon Routes -----
  addPlanAddon: (gymId: number, membershipId: number, data: { addon_id: number; frequency: number }) =>
    fetchApi(`/gyms/${gymId}/memberships/${membershipId}/addons`, { method: "POST", body: JSON.stringify(data) }),
  updatePlanAddon: (gymId: number, membershipId: number, planAddonId: number, data: { frequency: number }) =>
    fetchApi(`/gyms/${gymId}/memberships/${membershipId}/addons/${planAddonId}`, { method: "PUT", body: JSON.stringify(data) }),
  removePlanAddon: (gymId: number, membershipId: number, planAddonId: number) =>
    fetchApi(`/gyms/${gymId}/memberships/${membershipId}/addons/${planAddonId}`, { method: "DELETE" }),
};
