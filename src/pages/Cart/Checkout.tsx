import { useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    BadgeCheck,
    ChevronRight,
    CreditCard,
    Landmark,
    MapPin,
    QrCode,
    ReceiptText,
    Truck,
    Wallet,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";

type PaymentMethodType = "cash" | "bank_transfer";

type PaymentMethod = {
    id: string;
    code: string;
    name: string;
    type: PaymentMethodType;
    description?: string;
    qrImages?: string[];
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
};

type CheckoutCustomer = {
    fullName: string;
    phone: string;
    email: string;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function getMockCustomer(): CheckoutCustomer {
    if (typeof window !== "undefined") {
        try {
            const rawCurrentUser = localStorage.getItem("currentUser");
            if (rawCurrentUser) {
                const currentUser = JSON.parse(rawCurrentUser);
                return {
                    fullName:
                        currentUser?.fullName ||
                        currentUser?.name ||
                        currentUser?.username ||
                        "Nguyễn Văn A",
                    phone: currentUser?.phone || currentUser?.phoneNumber || "0987654321",
                    email: currentUser?.email || "nguyenvana@email.com",
                };
            }
        } catch {
            // giữ mock fallback
        }
    }

    return {
        fullName: "Nguyễn Văn A",
        phone: "0987654321",
        email: "nguyenvana@email.com",
    };
}

const mockPaymentMethods: PaymentMethod[] = [
    {
        id: "pm-transfer-vcb",
        code: "BANK_TRANSFER_VCB",
        name: "Chuyển khoản Vietcombank",
        type: "bank_transfer",
        description: "Chuyển khoản trước, hệ thống sẽ đối soát sau khi bạn thanh toán.",
        qrImages: [
            "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VCB-QR-01",
            "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VCB-QR-02",
        ],
        accountName: "CONG TY TEA SHOP",
        accountNumber: "0123456789",
        bankName: "Vietcombank",
    },
    {
        id: "pm-transfer-mbbank",
        code: "BANK_TRANSFER_MB",
        name: "Chuyển khoản MB Bank",
        type: "bank_transfer",
        description: "Bạn có thể quét một trong các mã QR bên dưới để thanh toán.",
        qrImages: [
            "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MBBANK-QR-01",
        ],
        accountName: "CONG TY TEA SHOP",
        accountNumber: "0987654321",
        bankName: "MB Bank",
    },
    {
        id: "pm-cash",
        code: "CASH",
        name: "Thanh toán tiền mặt khi nhận hàng",
        type: "cash",
        description: "Thanh toán trực tiếp cho nhân viên giao hàng khi nhận đơn.",
    },
];

function InfoField({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="rounded-[24px] border border-p-100 bg-p-50/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-n-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-p-700">
                    {icon}
                </span>
                <span>{label}</span>
            </div>
            <p className="break-words text-base font-semibold text-n-800">{value}</p>
        </div>
    );
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, subtotal, itemCount, clearCart } = useCart();
    const { showToast } = useToast();

    const customer = useMemo(() => getMockCustomer(), []);

    const [address, setAddress] = useState("");
    const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
        mockPaymentMethods[0]?.id || ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedPaymentMethod = useMemo(
        () => mockPaymentMethods.find((item) => item.id === selectedPaymentId) || null,
        [selectedPaymentId]
    );

    if (!items.length) {
        return <Navigate to="/cart" replace />;
    }

    const shippingFee = 0;
    const total = subtotal + shippingFee;

    const handleSubmitOrder = async () => {
        if (!address.trim()) {
            showToast("Vui lòng nhập địa chỉ nhận hàng.", "warning");
            return;
        }

        if (!selectedPaymentMethod) {
            showToast("Vui lòng chọn phương thức thanh toán.", "warning");
            return;
        }

        try {
            setIsSubmitting(true);

            await new Promise((resolve) => window.setTimeout(resolve, 500));

            clearCart();
            showToast("Đặt hàng thành công. Cảm ơn bạn đã mua hàng!", "success");
            navigate("/home", { replace: true });
        } catch {
            showToast("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container !pt-10 !pb-14">
            <div className="mb-8 mt-20 flex flex-wrap items-center justify-between gap-4">
                {/* <div>
                    <h1 className="mt-2 text-3xl font-bold text-n-800">Trang thanh toán</h1>
                    <p className="mt-2 max-w-2xl text-sm text-n-500">
                        Kiểm tra thông tin người nhận, nhập địa chỉ giao hàng và chọn phương thức thanh toán phù hợp.
                    </p>
                </div> */}

                <Link
                    to="/home"
                    className="inline-flex items-center gap-2 rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Trở về trang chủ
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px]">
                <div className="space-y-6">
                    <div className="rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
                        <div className="flex items-center justify-between gap-4 border-b border-p-100 pb-5">
                            <div>
                                <p className="text-sm text-n-500">Thông tin tài khoản</p>
                                <h2 className="text-2xl font-bold text-n-800">Thông tin người nhận</h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                                <BadgeCheck className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <InfoField label="Họ và tên" value={customer.fullName} icon={<ReceiptText className="h-4 w-4" />} />
                            <InfoField label="Số điện thoại" value={customer.phone} icon={<Truck className="h-4 w-4" />} />
                            <InfoField label="Email" value={customer.email} icon={<CreditCard className="h-4 w-4" />} />
                        </div>
                    </div>

                    <div className="rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
                        <div className="flex items-center justify-between gap-4 border-b border-p-100 pb-5">
                            <div>
                                <p className="text-sm text-n-500">Giao hàng</p>
                                <h2 className="text-2xl font-bold text-n-800">Địa chỉ nhận hàng</h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                                <MapPin className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label htmlFor="shipping-address" className="mb-2 block text-sm font-semibold text-n-700">
                                Địa chỉ chi tiết <span className="text-rose-600">*</span>
                            </label>
                            <textarea
                                id="shipping-address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                                placeholder="Nhập số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                rows={4}
                                className="w-full rounded-[24px] border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition placeholder:text-n-500 focus:border-p-400 focus:ring-4 focus:ring-p-100/70"
                            />
                        </div>
                    </div>

                    <div className="rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
                        <div className="flex items-center justify-between gap-4 border-b border-p-100 pb-5">
                            <div>
                                <p className="text-sm text-n-500">Thanh toán</p>
                                <h2 className="text-2xl font-bold text-n-800">Phương thức thanh toán</h2>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4">
                            {mockPaymentMethods.map((method) => {
                                const isSelected = selectedPaymentId === method.id;
                                const isTransfer = method.type === "bank_transfer";

                                return (
                                    <label
                                        key={method.id}
                                        className={`cursor-pointer rounded-[28px] border p-4 transition ${isSelected
                                            ? "border-p-500 bg-p-50 shadow-sm"
                                            : "border-p-100 bg-white hover:bg-p-50/50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                checked={isSelected}
                                                onChange={() => setSelectedPaymentId(method.id)}
                                                className="mt-1 h-4 w-4 accent-[#22B684]"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-p-700">
                                                        {isTransfer ? (
                                                            <Landmark className="h-5 w-5" />
                                                        ) : (
                                                            <Wallet className="h-5 w-5" />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h3 className="text-base font-bold text-n-800">{method.name}</h3>
                                                        <p className="mt-1 text-sm text-n-500">{method.description}</p>
                                                    </div>
                                                </div>

                                                {isSelected && isTransfer && (
                                                    <div className="mt-4 rounded-[24px] border border-p-100 bg-white p-4">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-p-700">
                                                            <QrCode className="h-4 w-4" />
                                                            Mã QR thanh toán
                                                        </div>

                                                        <div className="mt-3 grid gap-4 md:grid-cols-2">
                                                            {method.qrImages?.map((qrImage, index) => (
                                                                <div
                                                                    key={`${method.id}-${index}`}
                                                                    className="overflow-hidden rounded-[24px] border border-p-100 bg-p-50/40 p-4"
                                                                >
                                                                    <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                                                                        <img
                                                                            src={qrImage}
                                                                            alt={`${method.name} QR ${index + 1}`}
                                                                            className="h-full w-full object-contain"
                                                                        />
                                                                    </div>
                                                                    <div className="mt-3 space-y-1 text-sm text-n-600">
                                                                        <p>
                                                                            <span className="font-semibold text-n-800">Ngân hàng:</span> {method.bankName}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold text-n-800">Số tài khoản:</span> {method.accountNumber}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold text-n-800">Chủ tài khoản:</span> {method.accountName}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <aside className="h-fit rounded-[34px] border border-p-100 bg-white p-5 shadow-[0_20px_60px_rgba(6,40,32,0.08)] lg:sticky lg:top-24">
                    <div className="flex items-center justify-between gap-3 border-b border-p-100 pb-5">
                        <div>
                            <p className="text-sm text-n-500">Đơn hàng của bạn</p>
                            <h2 className="text-2xl font-bold text-n-800">{itemCount} sản phẩm</h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                            <ReceiptText className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="rounded-[24px] border border-p-100 bg-p-50/30 p-4"
                            >
                                <div className="flex gap-3">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
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
                                        <h3 className="line-clamp-2 text-sm font-semibold text-n-800">
                                            {item.name}
                                        </h3>
                                        <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                                            <span className="text-n-500">SL: {item.quantity}</span>
                                            <span className="font-bold text-p-700">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 space-y-3 border-t border-p-100 pt-5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-n-500">Tạm tính</span>
                            <span className="font-semibold text-n-800">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-n-500">Phí vận chuyển</span>
                            <span className="font-semibold text-n-800">{formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-dashed border-p-100 pt-3">
                            <span className="text-base font-semibold text-n-700">Tổng thanh toán</span>
                            <span className="text-2xl font-bold text-p-900">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </aside>
            </div>
        </section>
    );
}
