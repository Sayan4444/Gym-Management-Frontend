import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Payment } from "../../data/types";

export function usePayments(params?: { gym_id?: number; user_id?: number; status?: string; search?: string }) {
  return useQuery<{ count: number; payments: (Payment & { userName?: string })[] }>({
    queryKey: ["payments", params],
    queryFn: () => api.getPayments(params),
  });
}

export interface IOrderPayload {
  amount: number;
  paymentFor: string;
  planId?: number;
  addonId?: number;
}

export interface IOrderResponse {
  amount: number;
  currency: string;
  orderId?: number;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation<IOrderResponse, Error, IOrderPayload>({
    mutationFn: (data: IOrderPayload) => api.createOrder(data),
    onSuccess: (responseData: IOrderResponse, payload: IOrderPayload) => {
      if (payload.paymentFor === "Membership Plan") queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      if (payload.paymentFor === "Add-On") queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}

export interface IVerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface IVerifyPaymentResponse {
  message: string,
  payment: Payment
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation<IVerifyPaymentResponse, Error, IVerifyPaymentPayload>({
    mutationFn: (data: IVerifyPaymentPayload) => api.verifyPayment(data),
    onSuccess: (responseData: IVerifyPaymentResponse) => {
      if (responseData.payment.paymentFor === "Membership Plan") queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      if (responseData.payment.paymentFor === "Add-On") queryClient.invalidateQueries({ queryKey: ["addons"] });
    },
  });
}
