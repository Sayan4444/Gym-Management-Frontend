import { Payment } from '../../data/types';
import { fetchApi } from './core';

export const paymentApi = {
  // ----- Payment Routes -----
  createOrder: (data: Payment) => fetchApi("/payment/create-order", { method: "POST", body: JSON.stringify(data) }),
  verifyPayment: (data: Payment) => fetchApi("/payment/verify", { method: "POST", body: JSON.stringify(data) }),
};
