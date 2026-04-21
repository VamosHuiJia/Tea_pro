import axiosClient from "../../services/axiosClient";

export const getActiveCategories = async (): Promise<any> => {
    return await axiosClient.get(`/categories/all-categories`);
};
