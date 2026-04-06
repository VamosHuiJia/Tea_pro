import type { OrderStatus } from "../../pages/Admin/pages/Orders/OrderLayout";
import axiosClient from "../../services/axiosClient";

export const getAllOrders = async (): Promise<any> => {
    return await axiosClient.get(`/orders`);
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<any> => {
    return await axiosClient.put(`/orders/${id}/status`, { status });
};

export const updatePaymentStatus = async (orderId: number, status: string): Promise<any> => {
    return await axiosClient.put(`/orders/${orderId}/payment-status`, { status });
};

export const deleteOrder = async (id: number): Promise<any> => {
    return await axiosClient.delete(`/orders/${id}`);
};
