import axiosClient from "../../services/axiosClient";

export const loginUser = async (email: string, password: string): Promise<any> => {
    return await axiosClient.post(`/auth/login`, { email, password });
};

export const registerUser = async (username: string, email: string, password: string, phone: string): Promise<any> => {
    return await axiosClient.post(`/auth/register`, { username, email, password, phone });
};
