import axiosClient from "../../services/axiosClient";
import type { OrderStatus } from "../../pages/Admin/pages/Orders/OrderLayout";

export type CreateOrderPayload = {
  items: {
    productId: number | string;
    quantity: number;
  }[];
  shippingAddress: string;
  phone: string;
  method: string;
};

export const createOrder = async (data: CreateOrderPayload): Promise<any> => {
  return await axiosClient.post("/orders", data);
};

export const getMyOrders = async (): Promise<any> => {
  return await axiosClient.get("/orders/my-orders");
};

export const cancelOrder = async (id: number): Promise<any> => {
  return await axiosClient.put(`/orders/${id}/status`, { status: "cancelled" });
};
