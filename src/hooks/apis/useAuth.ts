import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/data/types";

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { access_token: string , gym_id?: number}) => api.googleLogin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// passing an object is optional
export function useMe(params?: { include?: string }) {
  return useQuery<User>({
    queryKey: ["me", params?.include],
    queryFn: () => api.getMe(params?.include),
  });
}
