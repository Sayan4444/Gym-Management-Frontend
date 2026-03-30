import { fetchApi } from './core';

export const paymentApi = {
  // ----- Payment Routes -----
  createOrder: (data: any) => fetchApi("/payment/create-order", { method: "POST", body: JSON.stringify(data) }),
  verifyPayment: (data: any) => fetchApi("/payment/verify", { method: "POST", body: JSON.stringify(data) }),
};
