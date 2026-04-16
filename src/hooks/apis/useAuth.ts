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

export function useMe(include?:string) {
  return useQuery<User>({
    queryKey: ["me", include],
    queryFn: () => api.getMe(include),
  });
}
