import { Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function CartPage() {
    const { items, subtotal, removeFromCart, updateQuantity, itemCount } = useCart();

    return (
        <section className="container !pt-10 !pb-14">
            <div className="mb-8">
                <p className="text-sm text-n-500">Mua sắm / Giỏ hàng</p>
                <h1 className="mt-2 text-3xl font-bold text-n-800">Giỏ hàng</h1>
            </div>

            <div className="mx-auto flex w-full justify-center">
                <div className="w-full lg:w-1/3">
                    <div className="overflow-hidden rounded-[34px] border border-p-100 bg-white shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
                        <div className="border-b border-p-100 px-5 py-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-n-500">Danh sách đã chọn</p>
                                    <h2 className="text-2xl font-bold text-n-800">
                                        {itemCount} sản phẩm
                                    </h2>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-p-50 text-p-700">
                                    <ShoppingBag className="h-8 w-8" />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-n-800">
                                    Chưa có sản phẩm nào
                                </h3>
                                <p className="mt-2 text-sm text-n-500">
                                    Bạn chưa thêm sản phẩm vào giỏ hàng.
                                </p>

                                <Link
                                    to="/products"
                                    className="mt-6 inline-flex items-center justify-center rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
                                >
                                    Đi mua ngay
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 px-4 py-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="rounded-[26px] border border-p-100 bg-p-50/40 p-4"
                                        >
                                            <div className="flex gap-4">
                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
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
                                                            <h3 className="truncate text-base font-semibold text-n-800">
                                                                {item.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-n-500">
                                                                {formatCurrency(item.price)}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.productId)}
                                                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-700 transition hover:bg-rose-50"
                                                            title="Xóa sản phẩm"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between gap-3">
                                                        <div className="inline-flex items-center rounded-2xl border border-p-100 bg-white">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(item.productId, item.quantity - 1)
                                                                }
                                                                className="flex h-10 w-10 items-center justify-center border-0 bg-transparent text-p-900"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>

                                                            <span className="min-w-[44px] text-center text-sm font-semibold text-n-800">
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

                                                        <p className="text-sm font-bold text-p-700">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-p-100 px-5 py-5">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-n-500">Tạm tính</span>
                                            <span className="font-semibold text-n-800">
                                                {formatCurrency(subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dashed border-p-100 pt-3">
                                            <span className="text-base font-semibold text-n-700">
                                                Tổng đơn hàng
                                            </span>
                                            <span className="text-xl font-bold text-p-900">
                                                {formatCurrency(subtotal)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to="/checkout"
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700"
                                    >
                                        Thanh toán
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}