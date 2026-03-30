import { fetchApi } from './core';

export const authApi = {
  // ----- Auth Routes -----
  googleLogin: (accessToken: string) => fetchApi("/auth/google", { method: "POST", body: JSON.stringify({ accessToken }) }),
  logout: () => fetchApi("/auth/logout", { method: "POST" }),
  getMe: () => fetchApi("/auth/me"),
};
