import type { PaymentFormValues } from "../../pages/Admin/pages/Payment/PaymentLayout";

const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL || "http://localhost:8000"}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export const getAllPaymentMethods = async () => {
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách thanh toán");
    return result;
};

export const createPaymentMethod = async (data: PaymentFormValues) => {
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi tạo PT thanh toán");
    return result;
};

export const updatePaymentMethod = async (id: number, data: PaymentFormValues) => {
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật PT thanh toán");
    return result;
};

export const deletePaymentMethod = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa PT thanh toán");
    return result;
};
