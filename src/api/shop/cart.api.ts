import axiosClient from "../../services/axiosClient";

export const cartApi = {
    getCart: () => {
        return axiosClient.get("/cart");
    },
    addToCart: (productId: string | number, quantity: number) => {
        return axiosClient.post("/cart", { productId, quantity });
    },
    updateQuantity: (productId: string | number, quantity: number) => {
        return axiosClient.put(`/cart/${productId}`, { quantity });
    },
    removeFromCart: (productId: string | number) => {
        return axiosClient.delete(`/cart/${productId}`);
    },
    clearCart: () => {
        return axiosClient.delete("/cart");
    }
};
