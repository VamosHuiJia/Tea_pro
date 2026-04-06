import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import { productList } from "../../../animations/data";
import { toSlug } from "../../../utils/slug";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const product = useMemo(
        () => productList.find((item) => toSlug(item.name) === id || item.id === Number(id)),
        [id]
    );

    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <section className="container !pt-10 !pb-16">
                <div className="rounded-[32px] border border-p-100 bg-white px-6 py-16 text-center shadow-[0_16px_40px_rgba(6,40,32,0.06)]">
                    <h1 className="text-3xl font-bold text-n-800">
                        Không tìm thấy sản phẩm
                    </h1>
                    <p className="mt-3 text-sm text-n-500">
                        Sản phẩm bạn đang xem không tồn tại trong dữ liệu tạm thời.
                    </p>
                    <Link
                        to="/products"
                        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
                    >
                        Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </section>
        );
    }

    const hasDiscount = Number(product.discountPercent) > 0;
    const maxQty = Math.max(1, product.quantity || 1);
    const finalPrice = Number(product.currentPrice || product.originalPrice);

    const increase = () => {
        setQuantity((prev) => Math.min(prev + 1, maxQty));
    };

    const decrease = () => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    };

    const handleQuantityInput = (value: string) => {
        const parsed = Number(value);

        if (Number.isNaN(parsed)) {
            setQuantity(1);
            return;
        }

        setQuantity(Math.min(Math.max(parsed, 1), maxQty));
    };

    const handleAddToCart = () => {
        if (!product.isActive) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: finalPrice,
            image: product.urlImg ?? "",
            quantity,
        });
    };

    return (
        <section className="container !pt-10 !pb-16 mt-20">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
            >
                <ChevronLeft className="h-4 w-4" />
                Quay lại
            </button>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="order-2 rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)] lg:order-1 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-p-50 px-4 py-2 text-sm font-semibold text-p-900">
                            {product.category.name}
                        </span>

                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${product.isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                        >
                            {product.isActive ? "Còn hàng" : "Hết hàng"}
                        </span>
                    </div>

                    <h1 className="mt-5 text-3xl font-bold text-n-800 md:text-4xl">
                        {product.name}
                    </h1>

                    <div className="mt-6 grid gap-4 rounded-[28px] bg-p-50/70 p-5 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-n-500">Danh mục</p>
                            <p className="mt-1 text-base font-semibold text-n-800">
                                {product.category.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-n-500">Thương hiệu</p>
                            <p className="mt-1 text-base font-semibold text-n-800">
                                {product.brand.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-n-500">Đã bán</p>
                            <p className="mt-1 text-base font-semibold text-n-800">
                                {product.sold} sản phẩm
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-n-500">Số lượng còn</p>
                            <p className="mt-1 text-base font-semibold text-n-800">
                                {product.quantity}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-bold text-n-800">Mô tả sản phẩm</h2>
                        <p className="mt-3 text-base leading-8 text-n-600">
                            {product.description || "Đang cập nhật mô tả sản phẩm."}
                        </p>
                    </div>

                    <div className="mt-8 rounded-[28px] border border-p-100 bg-white p-5">
                        <p className="text-sm text-n-500">Giá sản phẩm</p>

                        <div className="mt-2 flex flex-wrap items-end gap-3">
                            {hasDiscount && (
                                <span className="text-lg text-n-500 line-through">
                                    {formatCurrency(Number(product.originalPrice))}
                                </span>
                            )}

                            <span className="text-3xl font-bold text-p-900">
                                {formatCurrency(finalPrice)}
                            </span>

                            {hasDiscount && (
                                <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
                                    -{Number(product.discountPercent)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="mb-3 text-sm font-semibold text-n-700">Số lượng</p>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center overflow-hidden rounded-2xl border border-p-100 bg-white">
                                <button
                                    type="button"
                                    onClick={decrease}
                                    className="flex h-12 w-12 items-center justify-center border-0 bg-transparent text-p-900"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>

                                <input
                                    type="number"
                                    min={1}
                                    max={maxQty}
                                    value={quantity}
                                    onChange={(e) => handleQuantityInput(e.target.value)}
                                    className="h-12 w-16 border-x border-p-100 text-center text-sm font-semibold text-n-800 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={increase}
                                    className="flex h-12 w-12 items-center justify-center border-0 bg-transparent text-p-900"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!product.isActive}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:border-n-200 disabled:bg-n-200 disabled:text-n-500"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>

                <div className="order-1 overflow-hidden rounded-[34px] border border-p-100 bg-white shadow-[0_20px_60px_rgba(6,40,32,0.08)] lg:order-2">
                    {product.urlImg ? (
                        <img
                            src={product.urlImg}
                            alt={product.name}
                            className="h-full min-h-[420px] w-full object-cover"
                        />
                    ) : (
                        <div className="flex min-h-[420px] items-center justify-center text-sm text-n-500">
                            No image
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}