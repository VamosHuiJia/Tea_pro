import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Landmark,
  MapPin,
  QrCode,
  ReceiptText,
  Smartphone,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { createOrder } from "../../api/shop/order.api";

type PendingOrder = {
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  address: string;
  items: Array<{
    productId: string | number;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: {
    id: string;
    code: string;
    name: string;
    type: "cash" | "bank_transfer";
    description?: string;
  };
  createdAt: string;
};

type PaymentChannel = {
  id: string;
  name: string;
  typeLabel: string;
  accountName: string;
  accountNumber: string;
  provider: string;
  qrImage: string;
};

const paymentChannels: PaymentChannel[] = [
  {
    id: "momo",
    name: "Ví MoMo",
    typeLabel: "Ví điện tử",
    accountName: "TEA SHOP",
    accountNumber: "0901234567",
    provider: "MoMo",
    qrImage:
      "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=PAYMENT-MOMO-TEA-SHOP",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    typeLabel: "Ví điện tử",
    accountName: "TEA SHOP",
    accountNumber: "0901234567",
    provider: "ZaloPay",
    qrImage:
      "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=PAYMENT-ZALOPAY-TEA-SHOP",
  },
  {
    id: "vietcombank",
    name: "Vietcombank",
    typeLabel: "Ngân hàng",
    accountName: "CONG TY TEA SHOP",
    accountNumber: "0123456789",
    provider: "Vietcombank",
    qrImage:
      "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=PAYMENT-VCB-TEA-SHOP",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function readPendingOrder(): PendingOrder | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem("pending-payment-order");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const order = useMemo(() => readPendingOrder(), []);
  const [selectedChannelId, setSelectedChannelId] = useState(paymentChannels[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedChannel =
    paymentChannels.find((item) => item.id === selectedChannelId) || paymentChannels[0];

  if (!order || order.paymentMethod.type !== "bank_transfer") {
    return <Navigate to="/checkout" replace />;
  }

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Đã sao chép ${label}.`, "success");
    } catch {
      showToast(`Không thể sao chép ${label}.`, "error");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => window.setTimeout(resolve, 500));

      if (order) {
        const payload = {
          items: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: order.address,
          phone: order.customer.phone,
          method: selectedChannelId, // Use the selected method (momo, zalopay, vietcombank)
        };
        await createOrder(payload);
      }

      sessionStorage.removeItem("pending-payment-order");
      clearCart();
      showToast("Thanh toán đơn hàng thành công.", "success");
      navigate("/profile", { replace: true });
    } catch {
      showToast("Có lỗi xảy ra khi xác nhận thanh toán.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container !pb-14 !pt-10">
      <div className="mb-8 mt-20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-bold text-n-800">Hoàn tất thanh toán</h1>
        </div>

        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại checkout
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-10">
        <div className="space-y-6 xl:col-span-6">
          <div className="rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-p-100 pb-5">
              <div>
                <p className="text-sm text-n-500">Phương thức chuyển khoản</p>
                <h2 className="text-2xl font-bold text-n-800">Chọn mã QR để thanh toán</h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                <QrCode className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {paymentChannels.map((channel) => {
                const active = channel.id === selectedChannelId;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannelId(channel.id)}
                    className={`rounded-[28px] border p-4 text-left transition ${active
                      ? "border-p-500 bg-p-50 shadow-sm"
                      : "border-p-100 bg-white hover:bg-p-50/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-p-700">
                        {channel.typeLabel === "Ngân hàng" ? (
                          <Landmark className="h-5 w-5" />
                        ) : (
                          <Smartphone className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-n-800">{channel.name}</h3>
                        <p className="text-sm text-n-500">{channel.typeLabel}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
              <div className="rounded-[30px] border border-p-100 bg-p-50/35 p-5">
                <div className="overflow-hidden rounded-[24px] bg-white p-4">
                  <img
                    src={selectedChannel.qrImage}
                    alt={selectedChannel.name}
                    className="aspect-square h-full w-full object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-sm text-n-500">
                  Quét mã bằng {selectedChannel.provider} để thanh toán nhanh.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-p-100 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-p-700">
                    <CircleDollarSign className="h-4 w-4" />
                    Thông tin chuyển khoản
                  </div>

                  <div className="space-y-3 text-sm text-n-600">
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-p-50/40 px-4 py-3">
                      <span>Đơn vị nhận</span>
                      <span className="font-semibold text-n-800">{selectedChannel.accountName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-p-50/40 px-4 py-3">
                      <span>Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-n-800">{selectedChannel.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedChannel.accountNumber, "số tài khoản")}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-p-700 transition hover:bg-p-100"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-p-50/40 px-4 py-3">
                      <span>Đơn vị thanh toán</span>
                      <span className="font-semibold text-n-800">{selectedChannel.provider}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-p-50/40 px-4 py-3">
                      <span>Số tiền</span>
                      <span className="font-bold text-p-700">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-p-100 bg-p-50/30 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-p-700">
                    <BadgeCheck className="h-4 w-4" />
                    Lưu ý khi chuyển khoản
                  </div>
                  <div className="space-y-2 text-sm leading-6 text-n-600">
                    <p>- Chọn đúng mã QR hoặc tài khoản bạn muốn dùng để thanh toán.</p>
                    <p>- Nội dung chuyển khoản có thể dùng: <span className="font-semibold text-n-800">THANH TOAN DON HANG</span>.</p>
                    <p>- Sau khi chuyển khoản xong, bấm nút xác nhận bên dưới để hoàn tất đơn hàng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[34px] border border-p-100 bg-white p-6 shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-p-100 pb-5">
              <div>
                <p className="text-sm text-n-500">Thông tin giao hàng</p>
                <h2 className="text-2xl font-bold text-n-800">Người nhận & đơn hàng</h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                <ReceiptText className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm text-n-600">
              <div className="rounded-[24px] border border-p-100 bg-p-50/35 p-4">
                <p className="font-semibold text-n-800">{order.customer.fullName}</p>
                <p className="mt-1">{order.customer.phone}</p>
                <p>{order.customer.email}</p>
              </div>

              <div className="rounded-[24px] border border-p-100 bg-p-50/35 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-n-800">
                  <MapPin className="h-4 w-4 text-p-700" />
                  Địa chỉ nhận hàng
                </div>
                <p>{order.address}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 border-t border-p-100 pt-5">
              {order.items.map((item) => (
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
                      <h3 className="line-clamp-2 text-sm font-semibold text-n-800">{item.name}</h3>
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
                <span className="font-semibold text-n-800">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-n-500">Phí vận chuyển</span>
                <span className="font-semibold text-n-800">{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-p-100 pt-3">
                <span className="text-base font-semibold text-n-700">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-p-900">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Đang xác nhận..." : "Tôi đã thanh toán xong"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
