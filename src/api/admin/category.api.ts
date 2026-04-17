import axiosClient from "../../services/axiosClient";

export const getAllCategories = async (): Promise<any> => {
    return await axiosClient.get(`/categories/all-categories?all=true`);
};

export const getCategoryById = async (id: number): Promise<any> => {
    return await axiosClient.get(`/categories/${id}`);
};

export const createCategory = async (formData: FormData): Promise<any> => {
    return await axiosClient.post(`/categories/create-cate`, formData);
};

export const updateCategory = async (id: number, formData: FormData): Promise<any> => {
    return await axiosClient.patch(`/categories/update-cate/${id}`, formData);
};

export const deleteCategory = async (id: number): Promise<any> => {
    return await axiosClient.delete(`/categories/delete-cate/${id}`);
};
