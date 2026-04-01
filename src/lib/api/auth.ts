import { fetchApi } from './core';

export const authApi = {
  // ----- Auth Routes -----
  googleLogin: (body: {access_token: string}) => fetchApi("/auth/google", { method: "POST", body: JSON.stringify(body) }),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),
};
