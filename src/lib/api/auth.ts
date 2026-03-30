import { fetchApi } from './core';

export const authApi = {
  // ----- Auth Routes -----
  googleLogin: (data: any) => fetchApi("/auth/google", { method: "POST", body: JSON.stringify(data) }),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),
};
