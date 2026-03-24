import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
    addToCart: (item: AddToCartPayload) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "tea-cart-items";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (item: AddToCartPayload) => {
        setItems((prev) => {
            const index = prev.findIndex(
                (cartItem) => String(cartItem.productId) === String(item.productId)
            );

            if (index === -1) {
                return [
                    ...prev,
                    {
                        ...item,
                        quantity: Math.max(1, Number(item.quantity || 1)),
                    },
                ];
            }

            return prev.map((cartItem, idx) => {
                if (idx !== index) return cartItem;

                const nextQty = cartItem.quantity + Math.max(1, Number(item.quantity || 1));
                const safeQty = item.stock ? Math.min(nextQty, item.stock) : nextQty;

                return {
                    ...cartItem,
                    quantity: safeQty,
                };
            });
        });
    };

    const removeFromCart = (productId: string | number) => {
        setItems((prev) =>
            prev.filter((item) => String(item.productId) !== String(productId))
        );
    };

    const updateQuantity = (productId: string | number, quantity: number) => {
        const safeQty = Math.max(1, Number(quantity || 1));

        setItems((prev) =>
            prev.map((item) => {
                if (String(item.productId) !== String(productId)) return item;

                return {
                    ...item,
                    quantity: item.stock ? Math.min(safeQty, item.stock) : safeQty,
                };
            })
        );
    };

    const clearCart = () => setItems([]);

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