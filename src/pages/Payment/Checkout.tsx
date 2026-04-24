import { useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Landmark,
  MapPin,
  ReceiptText,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { createOrder } from "../../api/shop/order.api";

type PaymentMethodType = "cash" | "bank_transfer";

type PaymentMethod = {
  id: string;
  code: string;
  name: string;
  type: PaymentMethodType;
  description?: string;
};

type CheckoutCustomer = {
  fullName: string;
  phone: string;
  email: string;
};

type PendingOrder = {
  customer: CheckoutCustomer;
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
  paymentMethod: PaymentMethod;
  createdAt: string;
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
      //
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
    id: "pm-transfer",
    code: "BANK_TRANSFER",
    name: "Chuyển khoản / quét QR",
    type: "bank_transfer",
    description:
      "Chuyển sang trang thanh toán để quét QR MoMo, ZaloPay hoặc ngân hàng.",
  },
  {
    id: "pm-cash",
    code: "CASH",
    name: "Tiền mặt khi nhận hàng",
    type: "cash",
    description: "Thanh toán trực tiếp cho nhân viên giao hàng khi nhận đơn.",
  },
];

function SectionCard({
  eyebrow,
  title,
  icon,
  children,
  className = "",
  bodyClassName = "",
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={`rounded-[30px] border border-p-100 bg-white shadow-[0_20px_60px_rgba(6,40,32,0.08)] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-p-100 px-5 py-5">
        <div>
          <p className="text-sm text-n-500">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-bold text-n-800">{title}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-700">
          {icon}
        </div>
      </div>

      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

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
    <div className="rounded-[22px] border border-p-100 bg-p-50/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-n-500">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-p-700">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="break-words text-[15px] font-semibold text-n-800">{value}</p>
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
      await new Promise((resolve) => window.setTimeout(resolve, 400));

      if (selectedPaymentMethod.type === "cash") {
        const payload = {
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: address.trim(),
          phone: customer.phone,
          method: "cod",
        };
        await createOrder(payload);
        clearCart();
        sessionStorage.removeItem("pending-payment-order");
        showToast("Đơn hàng của bạn đã được xác nhận.", "success");
        navigate("/profile", { replace: true });
        return;
      }

      const pendingOrder: PendingOrder = {
        customer,
        address: address.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: selectedPaymentMethod,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("pending-payment-order", JSON.stringify(pendingOrder));
      navigate("/payment");
    } catch {
      showToast("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container !pb-14 !pt-10">
      <div className="mb-8 mt-20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-bold text-n-800">Trang thanh toán</h1>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Trở về giỏ hàng
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          eyebrow="Đơn hàng của bạn"
          title={`${itemCount} sản phẩm`}
          icon={<ShoppingBag className="h-6 w-6" />}
          className="h-full"
        >
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-[24px] border border-p-100 bg-p-50/35 p-4"
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
                    <h3 className="line-clamp-2 text-base font-bold text-n-800">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-n-500">
                      Đơn giá: {formatCurrency(item.price)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-n-700">
                        SL: {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-p-700">
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
        </SectionCard>

        <div className="grid gap-6">
          <SectionCard
            eyebrow="Thông tin tài khoản"
            title="Người nhận"
            icon={<BadgeCheck className="h-6 w-6" />}
            className="h-full"
          >
            <div className="grid gap-4">
              <InfoField
                label="Họ và tên"
                value={customer.fullName}
                icon={<ReceiptText className="h-4 w-4" />}
              />
              <InfoField
                label="Số điện thoại"
                value={customer.phone}
                icon={<Truck className="h-4 w-4" />}
              />
              <InfoField
                label="Email"
                value={customer.email}
                icon={<CreditCard className="h-4 w-4" />}
              />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Giao hàng"
            title="Địa chỉ nhận hàng"
            icon={<MapPin className="h-6 w-6" />}
            className="h-full"
          >
            <label
              htmlFor="shipping-address"
              className="mb-2 block text-sm font-semibold text-n-700"
            >
              Địa chỉ chi tiết <span className="text-rose-600">*</span>
            </label>

            <textarea
              id="shipping-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Nhập số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              rows={10}
              className="w-full rounded-[22px] border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition placeholder:text-n-500 focus:border-p-400 focus:ring-4 focus:ring-p-100/70"
            />
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Thanh toán"
          title="Phương thức"
          icon={<Wallet className="h-6 w-6" />}
          className="h-full xl:sticky xl:top-24"
        >
          <div className="space-y-4">
            {mockPaymentMethods.map((method) => {
              const isSelected = selectedPaymentId === method.id;
              const isTransfer = method.type === "bank_transfer";

              return (
                <label
                  key={method.id}
                  className={`block cursor-pointer rounded-[24px] border p-4 transition ${isSelected
                      ? "border-p-500 bg-p-50 shadow-sm"
                      : "border-p-100 bg-white hover:bg-p-50/50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={isSelected}
                      onChange={() => setSelectedPaymentId(method.id)}
                      className="mt-1 h-4 w-4 accent-[#22B684]"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-p-700">
                          {isTransfer ? (
                            <Landmark className="h-5 w-5" />
                          ) : (
                            <Wallet className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-n-800">{method.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-n-500">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}

            <div className="rounded-[24px] border border-p-100 bg-p-50/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-n-500">Số lượng</span>
                <span className="font-semibold text-n-800">{itemCount} sản phẩm</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-n-500">Phương thức</span>
                <span className="text-right font-semibold text-n-800">
                  {selectedPaymentMethod?.name || "Chưa chọn"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-p-100 pt-3">
                <span className="text-base font-semibold text-n-700">Tổng tiền</span>
                <span className="text-xl font-bold text-p-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : selectedPaymentMethod?.type === "bank_transfer"
                  ? "Tiếp tục thanh toán"
                  : "Xác nhận đơn hàng"}
              <ChevronRight className="h-4 w-4" />
            </button>

            <p className="text-sm leading-6 text-n-500">
              {selectedPaymentMethod?.type === "bank_transfer"
                ? "Hệ thống sẽ chuyển bạn sang trang thanh toán QR."
                : "Đơn hàng sẽ được xác nhận ngay sau khi bạn hoàn tất."}
            </p>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}