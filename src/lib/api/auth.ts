import { fetchApi } from './core';

export const authApi = {
  // ----- Auth Routes -----
  googleLogin: (body: {access_token: string, gym_id?: number}) => fetchApi("/auth/google", { method: "POST", body: JSON.stringify(body) }),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: (include?:string) => fetchApi("/auth/me"+ (include ? `?include=${include}` : "")),
};
