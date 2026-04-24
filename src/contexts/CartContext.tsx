import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { cartApi } from "../api/shop/cart.api";
import { useToast } from "./ToastContext";

export type CartItem = {
    productId: string | number;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    stock?: number;
    description?: string;
    categoryName?: string;
};

type AddToCartPayload = Omit<CartItem, "quantity"> & {
    quantity?: number;
};

type CartContextType = {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    addToCart: (item: AddToCartPayload) => Promise<void>;
    removeFromCart: (productId: string | number) => Promise<void>;
    updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchCart = async () => {
        if (!user) {
            setItems([]);
            return;
        }
        try {
            const res: any = await cartApi.getCart();
            if (res && res.cart && res.cart.items) {
                const mappedItems = res.cart.items.map((apiItem: any) => ({
                    productId: apiItem.product.id,
                    name: apiItem.product.name,
                    image: apiItem.product.urlImg,
                    price: Number(apiItem.product.currentPrice || apiItem.product.originalPrice),
                    quantity: apiItem.quantity,
                    stock: apiItem.product.quantity
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (item: AddToCartPayload) => {
        if (!user) {
            showToast("Vui lòng đăng nhập để sử dụng giỏ hàng", "warning");
            return;
        }

        try {
            await cartApi.addToCart(item.productId, item.quantity || 1);
            showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
            await fetchCart();
        } catch (error: any) {
            if (error.response?.data?.code === "EXCEEDS_STOCK") {
                showToast("Sản phẩm đã hết hoặc vượt quá số lượng tồn kho", "error");
                await fetchCart();
            } else {
                showToast("Lỗi khi thêm vào giỏ hàng", "error");
            }
        }
    };

    const removeFromCart = async (productId: string | number) => {
        if (!user) return;
        try {
            await cartApi.removeFromCart(productId);
            await fetchCart();
        } catch (error) {
            showToast("Lỗi khi xóa sản phẩm khỏi giỏ hàng", "error");
        }
    };

    const updateQuantity = async (productId: string | number, quantity: number) => {
        if (!user) return;
        const safeQty = Math.max(1, Number(quantity || 1));

        try {
            await cartApi.updateQuantity(productId, safeQty);
            await fetchCart();
        } catch (error: any) {
             if (error.response?.data?.code === "EXCEEDS_STOCK") {
                showToast("Sản phẩm đã hết hoặc vượt quá số lượng tồn kho", "error");
                await fetchCart();
            } else {
                showToast("Lỗi khi cập nhật số lượng", "error");
            }
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            await cartApi.clearCart();
            setItems([]);
        } catch (error) {
            showToast("Lỗi khi xóa giỏ hàng", "error");
        }
    };

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        [items]
    );

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
                0
            ),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            itemCount,
            subtotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            fetchCart
        }),
        [items, itemCount, subtotal]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}