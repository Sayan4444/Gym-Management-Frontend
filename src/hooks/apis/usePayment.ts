import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Payment } from "../../data/types";

export function usePayments(params?: { gym_id?: number; user_id?: number; status?: string; search?: string }) {
  return useQuery<{ count: number; payments: (Payment & { userName?: string })[] }>({
    queryKey: ["payments", params],
    queryFn: () => api.getPayments(params),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Payment) => api.createOrder(data),
    onSuccess: (responseData: Payment) => {
      if (responseData.paymentFor === "Membership Plan") queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      if (responseData.paymentFor === "Add-On") queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Payment) => api.verifyPayment(data),
    onSuccess: (responseData: Payment) => {
      if (responseData.paymentFor === "Membership Plan") queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      if (responseData.paymentFor === "Add-On") queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}
