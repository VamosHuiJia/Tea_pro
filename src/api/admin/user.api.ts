import axiosClient from "../../services/axiosClient";

export const getAllUsers = async (): Promise<any> => {
    return await axiosClient.get(`/users/all-user`);
};

export const createUser = async (formData: FormData): Promise<any> => {
    return await axiosClient.post(`/users/create-user`, formData);
};

export const updateUser = async (id: string, formData: FormData): Promise<any> => {
    return await axiosClient.put(`/users/update-user/${id}`, formData);
};

export const deleteUser = async (id: string): Promise<any> => {
    return await axiosClient.delete(`/users/${id}`);
};
