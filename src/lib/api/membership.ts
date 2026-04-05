import { MembershipPlan } from '../../data/types';
import { UpdateMembershipPayload } from '../../hooks/apis/useMembership';
import { fetchApi } from './core';

export const membershipApi = {
  // ----- Membership Routes -----
  // A public route to fetch the memberships offered by gym
  getMembershipPlansByGym: (gymId: number ) => fetchApi(`/gyms/${gymId}/memberships`),
  // An authenticated route hit by loggedin user
  getMembershipPlans: (gymId?: number) => fetchApi(gymId ? `/memberships?gym_id=${gymId}` : "/memberships"),
  createMembershipPlan: (gymId: number , data: MembershipPlan) => fetchApi(`/gyms/${gymId}/memberships`, { method: "POST", body: JSON.stringify(data) }),
  updateMembershipPlan: (gymId: number, membershipId: number, data: UpdateMembershipPayload) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMembershipPlan: (gymId: number , membershipId: number ) => fetchApi(`/gyms/${gymId}/memberships/${membershipId}`, { method: "DELETE" }),
};
