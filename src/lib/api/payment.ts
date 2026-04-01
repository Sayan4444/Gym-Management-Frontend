import { Payment } from '../../data/types';
import { fetchApi } from './core';

export const paymentApi = {
  // ----- Payment Routes -----
  createOrder: (data: Payment) => fetchApi("/payment/create-order", { method: "POST", body: JSON.stringify(data) }),
  verifyPayment: (data: Payment) => fetchApi("/payment/verify", { method: "POST", body: JSON.stringify(data) }),
  getPayments: (params?: { gym_id?: number; user_id?: number; status?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.gym_id) qs.append("gym_id", params.gym_id.toString());
    if (params?.user_id) qs.append("user_id", params.user_id.toString());
    if (params?.status) qs.append("status", params.status);
    if (params?.search) qs.append("search", params.search);
    const query = qs.toString() ? `?${qs.toString()}` : "";
    return fetchApi(`/payment${query}`);
  },
};
