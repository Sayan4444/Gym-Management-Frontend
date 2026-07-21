import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UserAddon } from "@/data/types";
import type { ScheduleUserAddonPayload } from "@/lib/api/userAddon";

export function useCreateUserAddon() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UserAddon) => api.createUserAddon(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addons"] });
        },
    });
}

export function useUserAddons(gymId?: number, userId?: number) {
    return useQuery<{ count: number, user_addons: UserAddon[]}>({
        queryKey: ["user-addons", gymId, userId],
        queryFn: () => api.getUserAddons(gymId, userId),
    });
}

export function useUpdateUserAddon() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserAddon }) => api.updateUserAddon(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addons"] });
        },
    });
}

export function useDeleteUserAddon() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteUserAddon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addons"] });
        },
    });
}

export function useScheduleUserAddon() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ScheduleUserAddonPayload }) =>
            api.scheduleUserAddon(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-addons"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
