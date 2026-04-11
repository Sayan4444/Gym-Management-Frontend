import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface IBookDemoPayload {
    fullName: string;
    mobile: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
}

export function useBookDemo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: IBookDemoPayload) => api.submitDemoRequest(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
