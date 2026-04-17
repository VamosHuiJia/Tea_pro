import axiosClient from "../../services/axiosClient";

export const getAllProducts = async (): Promise<any> => {
    return await axiosClient.get(`/products/all-products?all=true`);
};

export const getProductById = async (id: number): Promise<any> => {
    return await axiosClient.get(`/products/${id}`);
};

export const createProduct = async (formData: FormData): Promise<any> => {
    return await axiosClient.post(`/products/create-product`, formData);
};

export const updateProduct = async (id: number, formData: FormData): Promise<any> => {
    return await axiosClient.patch(`/products/update-product/${id}`, formData);
};

export const deleteProduct = async (id: number): Promise<any> => {
    return await axiosClient.delete(`/products/delete-product/${id}`);
};
