import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: any) => api.createOrder(data),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: any) => api.verifyPayment(data),
  });
}
