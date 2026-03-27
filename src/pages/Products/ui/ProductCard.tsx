import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import type { ProductItem } from "../../../animations/data";
import { useTruncate } from "../../../hooks/useTruncate";

type ProductCardProps = {
    product: ProductItem;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const hasDiscount = Number(product.discountPercent) > 0;
    const finalPrice = Number(product.currentPrice || product.originalPrice);

    const { ref: descriptionRef, truncatedText, isTruncated } = useTruncate({
        text: product.description ?? "",
        maxLines: 2,
    });

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.isActive) return;

        addToCart({
            productId: product.id,
            name: product.name,
            price: finalPrice,
            image: product.urlImg ?? "",
            quantity: 1,
        });
    };

    return (
        <Link
            to={`/products/${product.id}`}
            className="group relative block overflow-hidden rounded-[28px] border border-p-100 bg-white shadow-[0_16px_40px_rgba(6,40,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(6,40,32,0.12)]"
        >
            {hasDiscount && (
                <div className="absolute right-[-42px] top-5 z-20 w-[150px] rotate-45 bg-rose-500 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                    Giảm {Number(product.discountPercent)}%
                </div>
            )}

            <div className="relative h-[250px] overflow-hidden bg-p-50">
                {product.urlImg ? (
                    <img
                        src={product.urlImg}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-n-500">
                        No image
                    </div>
                )}

                {!product.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-n-800/45 backdrop-blur-[2px]">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600">
                            Hết hàng
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold text-n-800">
                        {product.name}
                    </h3>
                    <p
                        ref={descriptionRef as any}
                        className="mt-2 text-sm text-n-500 min-h-[40px]"
                        title={isTruncated ? (product.description ?? undefined) : undefined}
                    >
                        {truncatedText}
                    </p>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        {hasDiscount ? (
                            <>
                                <p className="text-sm text-n-500 line-through">
                                    {formatCurrency(Number(product.originalPrice))}
                                </p>
                                <p className="mt-1 text-xl font-bold text-p-900">
                                    {formatCurrency(finalPrice)}
                                </p>
                            </>
                        ) : (
                            <p className="text-xl font-bold text-p-900">
                                {formatCurrency(finalPrice)}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!product.isActive}
                        className="absolute bottom-6 right-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-p-900 bg-p-900 text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:border-n-200 disabled:bg-n-200 disabled:text-n-500"
                        title="Thêm vào giỏ hàng"
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
}