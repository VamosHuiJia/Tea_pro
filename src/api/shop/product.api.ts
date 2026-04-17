import axiosClient from "../../services/axiosClient";

export const getAllProducts = async (): Promise<any> => {
    return await axiosClient.get(`/products/all-products`);
};

export const getSingleProduct = async (idOrSlug: string | number): Promise<any> => {
    return await axiosClient.get(`/products/${idOrSlug}`);
};
