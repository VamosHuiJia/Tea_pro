import type { PaymentFormValues } from "../../pages/Admin/pages/Payment/PaymentLayout";
import axiosClient from "../../services/axiosClient";

export const getAllPaymentMethods = async (): Promise<any> => {
    return await axiosClient.get(`/payment-methods`);
};

export const createPaymentMethod = async (data: PaymentFormValues): Promise<any> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "image" && data.image) {
            formData.append("image", data.image);
        } else if (key !== "image" && data[key as keyof PaymentFormValues] !== undefined && data[key as keyof PaymentFormValues] !== null) {
            formData.append(key, String(data[key as keyof PaymentFormValues]));
        }
    });

    return await axiosClient.post(`/payment-methods`, formData);
};

export const updatePaymentMethod = async (id: number, data: PaymentFormValues): Promise<any> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (key === "image" && data.image) {
            formData.append("image", data.image);
        } else if (key !== "image" && data[key as keyof PaymentFormValues] !== undefined && data[key as keyof PaymentFormValues] !== null) {
            formData.append(key, String(data[key as keyof PaymentFormValues]));
        }
    });

    return await axiosClient.put(`/payment-methods/${id}`, formData);
};

export const deletePaymentMethod = async (id: number): Promise<any> => {
    return await axiosClient.delete(`/payment-methods/${id}`);
};
