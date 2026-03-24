import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

type CartDrawerProps = {
    open: boolean;
    onClose: () => void;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    const { items, subtotal, itemCount, removeFromCart, updateQuantity } = useCart();

    return (
        <div
            className={`fixed inset-0 z-[70] transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                }`}
        >
            <div
                className="absolute inset-0 bg-n-800/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <aside
                className={`absolute right-0 top-0 flex h-full w-[92vw] max-w-[420px] flex-col border-l border-p-100 bg-white shadow-2xl transition-transform duration-300 lg:max-w-[32vw] ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-p-100 px-5 py-4">
                    <div>
                        <p className="text-sm text-n-500">Giỏ hàng của bạn</p>
                        <h3 className="text-xl font-bold text-n-800">
                            {itemCount} sản phẩm
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 transition hover:bg-p-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-p-50 text-p-700">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <h4 className="mt-5 text-xl font-bold text-n-800">
                            Giỏ hàng đang trống
                        </h4>
                        <p className="mt-2 text-sm text-n-500">
                            Hãy thêm vài sản phẩm trà bạn thích rồi quay lại thanh toán.
                        </p>

                        <Link
                            to="/products"
                            onClick={onClose}
                            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
                        >
                            Đi tới sản phẩm
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="rounded-[28px] border border-p-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-p-50">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-n-500">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className="truncate text-base font-semibold text-n-800">
                                                        {item.name}
                                                    </h4>
                                                    <p className="mt-1 text-sm text-n-500">
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-3">
                                                <div className="inline-flex items-center rounded-2xl border border-p-100 bg-p-50">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(item.productId, item.quantity - 1)
                                                        }
                                                        className="flex h-10 w-10 items-center justify-center border-0 bg-transparent text-p-900"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>

                                                    <span className="min-w-[40px] text-center text-sm font-semibold text-n-800">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(item.productId, item.quantity + 1)
                                                        }
                                                        className="flex h-10 w-10 items-center justify-center border-0 bg-transparent text-p-900"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <p className="text-sm font-semibold text-p-700">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-p-100 bg-white px-5 py-5">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-n-500">Tạm tính</span>
                                <span className="text-lg font-bold text-p-900">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center rounded-2xl border border-p-200 bg-white px-4 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
                                >
                                    Xem giỏ hàng
                                </Link>

                                <Link
                                    to="/checkout"
                                    onClick={onClose}
                                    className="inline-flex items-center justify-center rounded-2xl border border-p-900 bg-p-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
                                >
                                    Thanh toán
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}