import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Landmark,
  Mail,
  MapPin,
  Phone,
  QrCode,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";

type PaymentMethod = "vietcombank" | "mbbank" | "cod";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

const paymentMethods: {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "vietcombank",
    title: "Quét QR Vietcombank",
    description: "Thanh toán nhanh bằng mã QR hoặc chuyển khoản Vietcombank.",
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    id: "mbbank",
    title: "Chuyển khoản MB Bank",
    description: "Phù hợp khi bạn muốn chuyển khoản thủ công qua tài khoản MB Bank.",
    icon: <Landmark className="h-5 w-5" />,
  },
  {
    id: "cod",
    title: "Thanh toán khi nhận hàng",
    description: "Thanh toán trực tiếp cho nhân viên giao hàng khi nhận đơn.",
    icon: <Banknote className="h-5 w-5" />,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function CheckoutSection({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-p-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,40,32,0.06)] md:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-p-100 pb-5">
        <div>
          <p className="text-sm text-n-500">{subtitle}</p>
          <h2 className="mt-1 text-2xl font-bold text-n-800">{title}</h2>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-p-50 text-p-700">
          {icon}
        </div>
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}

export default function Checkout() {
  const { items, subtotal, itemCount } = useCart();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vietcombank");
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const selectedPayment = useMemo(
    () => paymentMethods.find((method) => method.id === paymentMethod),
    [paymentMethod]
  );

  const handleChange = (
    key: keyof CheckoutForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      showToast("Vui lòng nhập họ và tên người nhận.", "warning");
      return;
    }

    if (!form.phone.trim()) {
      showToast("Vui lòng nhập số điện thoại.", "warning");
      return;
    }

    if (!form.address.trim()) {
      showToast("Vui lòng nhập địa chỉ nhận hàng.", "warning");
      return;
    }

    showToast("Đã lưu thông tin thanh toán. Bạn có thể nối tiếp API đặt hàng ở bước này.", "success");
  };

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <section className="container !pt-10 !pb-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-n-500">Mua sắm / Giỏ hàng / Thanh toán</p>
          <h1 className="mt-2 text-3xl font-bold text-n-800 md:text-4xl">
            Thanh toán đơn hàng
          </h1>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-p-100 bg-white px-5 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Trở lại giỏ hàng
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-10 xl:items-start">
          <div className="space-y-6 xl:col-span-6">
            <section className="rounded-[32px] border border-p-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,40,32,0.06)] md:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-p-100 pb-5">
                <div>
                  <p className="text-sm text-n-500">Đơn hàng của bạn</p>
                  <h2 className="mt-1 text-2xl font-bold text-n-800">
                    {itemCount} sản phẩm
                  </h2>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                  <ShoppingBag className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-[28px] border border-p-100 bg-p-50/40 p-4 md:p-5"
                  >
                    <div className="flex gap-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white">
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
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-lg font-semibold text-n-800">
                              {item.name}
                            </h3>
                            {item.categoryName ? (
                              <p className="mt-1 text-sm text-n-500">{item.categoryName}</p>
                            ) : null}
                          </div>

                          <p className="shrink-0 text-base font-bold text-p-700">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-n-600 sm:grid-cols-3">
                          <div className="rounded-2xl border border-p-100 bg-white px-4 py-3">
                            <p className="text-n-500">Đơn giá</p>
                            <p className="mt-1 font-semibold text-n-800">
                              {formatCurrency(item.price)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-p-100 bg-white px-4 py-3">
                            <p className="text-n-500">Số lượng</p>
                            <p className="mt-1 font-semibold text-n-800">SL: {item.quantity}</p>
                          </div>

                          <div className="rounded-2xl border border-p-100 bg-white px-4 py-3">
                            <p className="text-n-500">Tạm tính</p>
                            <p className="mt-1 font-semibold text-n-800">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-p-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,40,32,0.06)] md:p-7 xl:sticky xl:top-24">
              <div className="flex items-start justify-between gap-4 border-b border-p-100 pb-5">
                <div>
                  <p className="text-sm text-n-500">Tổng quan thanh toán</p>
                  <h2 className="mt-1 text-2xl font-bold text-n-800">Chi tiết đơn hàng</h2>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                  <ClipboardList className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-n-500">Tạm tính</span>
                  <span className="font-semibold text-n-800">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-n-500">Phí vận chuyển</span>
                  <span className="font-semibold text-n-800">{formatCurrency(shippingFee)}</span>
                </div>

                <div className="border-t border-dashed border-p-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-n-800">Tổng thanh toán</span>
                    <span className="text-3xl font-bold text-p-900">{formatCurrency(total)}</span>
                  </div>

                  <p className="mt-2 text-sm text-n-500">
                    Phương thức đang chọn: {selectedPayment?.title}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <CheckoutSection
              subtitle="Thông tin giao hàng"
              title="Người nhận & địa chỉ"
              icon={<User className="h-7 w-7" />}
            >
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-n-700">
                    <User className="h-4 w-4 text-p-700" />
                    Họ và tên
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => handleChange("fullName", event.target.value)}
                    placeholder="Nhập họ và tên người nhận"
                    className="h-14 w-full rounded-2xl border border-p-100 bg-p-50/40 px-4 text-base text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-n-700">
                      <Phone className="h-4 w-4 text-p-700" />
                      Số điện thoại
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="h-14 w-full rounded-2xl border border-p-100 bg-p-50/40 px-4 text-base text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-n-700">
                      <Mail className="h-4 w-4 text-p-700" />
                      Email
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      placeholder="Nhập email"
                      className="h-14 w-full rounded-2xl border border-p-100 bg-p-50/40 px-4 text-base text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-n-700">
                    <MapPin className="h-4 w-4 text-p-700" />
                    Địa chỉ nhận hàng
                  </span>
                  <textarea
                    value={form.address}
                    onChange={(event) => handleChange("address", event.target.value)}
                    placeholder="Nhập số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    rows={4}
                    className="w-full rounded-2xl border border-p-100 bg-p-50/40 px-4 py-4 text-base text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 text-sm font-medium text-n-700">Ghi chú đơn hàng</span>
                  <textarea
                    value={form.note}
                    onChange={(event) => handleChange("note", event.target.value)}
                    placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                    rows={3}
                    className="w-full rounded-2xl border border-p-100 bg-p-50/40 px-4 py-4 text-base text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                  />
                </label>
              </div>
            </CheckoutSection>

            <CheckoutSection
              subtitle="Thanh toán"
              title="Chọn phương thức thanh toán"
              icon={<CreditCard className="h-7 w-7" />}
            >
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const active = paymentMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`block cursor-pointer rounded-[28px] border p-4 transition md:p-5 ${
                        active
                          ? "border-p-400 bg-p-50 shadow-[0_12px_30px_rgba(18,137,99,0.08)]"
                          : "border-p-100 bg-white hover:bg-p-50/50"
                      }`}
                    >
                      <div className="flex gap-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={active}
                          onChange={() => setPaymentMethod(method.id)}
                          className="mt-1 h-5 w-5 accent-[hsl(150,74%,30%)]"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                              {method.icon}
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold text-n-800">
                                {method.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-n-500">
                                {method.description}
                              </p>
                            </div>
                          </div>

                          {active && method.id !== "cod" ? (
                            <div className="mt-4 rounded-[24px] border border-p-100 bg-white p-4 md:p-5">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {[1, 2].map((index) => (
                                  <div
                                    key={index}
                                    className="rounded-[22px] border border-p-100 bg-p-50/40 p-3"
                                  >
                                    <div className="aspect-square overflow-hidden rounded-2xl bg-white p-2">
                                      <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-p-200 bg-n-50 text-center text-sm font-semibold text-n-500">
                                        Mã QR {index}
                                      </div>
                                    </div>

                                    <div className="mt-3 space-y-2 text-sm">
                                      <p>
                                        <span className="font-semibold text-n-800">Ngân hàng:</span>{" "}
                                        <span className="text-n-500">
                                          {method.id === "vietcombank" ? "Vietcombank" : "MB Bank"}
                                        </span>
                                      </p>
                                      <p>
                                        <span className="font-semibold text-n-800">Số tài khoản:</span>{" "}
                                        <span className="text-n-500">0123456789</span>
                                      </p>
                                      <p>
                                        <span className="font-semibold text-n-800">Chủ tài khoản:</span>{" "}
                                        <span className="text-n-500">CÔNG TY TEA SHOP</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </CheckoutSection>

            <div className="rounded-[32px] border border-p-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,40,32,0.06)] md:p-7">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-4 text-base font-semibold text-white transition hover:bg-p-700"
              >
                Đặt hàng ngay
                <ChevronRight className="h-5 w-5" />
              </button>

              <p className="mt-3 text-center text-sm leading-6 text-n-500">
                Sau khi bấm đặt hàng, bạn có thể gọi API tạo đơn và điều hướng sang trang xác nhận đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
