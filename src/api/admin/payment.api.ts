import type { PaymentFormValues } from "../../pages/Admin/pages/Payment/PaymentLayout";

const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }
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
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "image" && data.image) {
            formData.append("image", data.image);
        } else if (key !== "image" && data[key as keyof PaymentFormValues] !== undefined && data[key as keyof PaymentFormValues] !== null) {
            formData.append(key, String(data[key as keyof PaymentFormValues]));
        }
    });

    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: formData
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi tạo PT thanh toán");
    return result;
};

export const updatePaymentMethod = async (id: number, data: PaymentFormValues) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "image" && data.image) {
            formData.append("image", data.image);
        } else if (key !== "image" && data[key as keyof PaymentFormValues] !== undefined && data[key as keyof PaymentFormValues] !== null) {
            formData.append(key, String(data[key as keyof PaymentFormValues]));
        }
    });

    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: formData
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
