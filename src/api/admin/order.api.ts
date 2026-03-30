import type { OrderStatus } from "../../pages/Admin/pages/Orders/OrderLayout";

const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export const getAllOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách đơn hàng");
    return result;
};

export const updateOrderStatus = async (id: number, status: OrderStatus) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật trạng thái đơn hàng");
    return result;
};

export const updatePaymentStatus = async (orderId: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật trạng thái thanh toán");
    return result;
};

export const deleteOrder = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa đơn hàng");
    return result;
};
