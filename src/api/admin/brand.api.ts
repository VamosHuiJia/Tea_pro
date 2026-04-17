import axiosClient from "../../services/axiosClient";

export const getAllBrands = async (): Promise<any> => {
    return await axiosClient.get(`/brands/all-brands?all=true`);
};

export const getBrandById = async (id: number): Promise<any> => {
    return await axiosClient.get(`/brands/${id}`);
};

export const createBrand = async (formData: FormData): Promise<any> => {
    return await axiosClient.post(`/brands/create-brand`, formData);
};

export const updateBrand = async (id: number, formData: FormData): Promise<any> => {
    return await axiosClient.patch(`/brands/update-brand/${id}`, formData);
};

export const deleteBrand = async (id: number): Promise<any> => {
    return await axiosClient.delete(`/brands/delete-brand/${id}`);
};
