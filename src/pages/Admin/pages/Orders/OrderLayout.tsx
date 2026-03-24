import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  Eye,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import OrderList from "./OrderList";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

type PaymentMethod = "cod" | "vnpay" | "momo" | "zalopay";
type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type OrderDetailItem = {
  id: number;
  productId: number;
  productName: string;
  image: string;
  quantity: number;
  price: number;
};

export type OrderItem = {
  id: number;
  userId: number;
  userName: string;
  email: string;
  phone: string | null;
  shippingAddress: string | null;
  totalAmount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string | null;
  };
  orderDetails: OrderDetailItem[];
};

const mockOrders: OrderItem[] = [
  {
    id: 1012,
    userId: 12,
    userName: "Nguyễn Minh Anh",
    email: "minhanh@gmail.com",
    phone: "0987654321",
    shippingAddress: "18 Hàng Bông, Hoàn Kiếm, Hà Nội",
    totalAmount: 345000,
    status: "pending",
    created_at: "2026-03-24T07:20:00.000Z",
    updated_at: "2026-03-24T07:20:00.000Z",
    payment: {
      method: "cod",
      status: "success",
      transactionId: null,
    },
    orderDetails: [
      {
        id: 1,
        productId: 31,
        productName: "Trà Sen Tây Hồ",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop",
        quantity: 2,
        price: 95000,
      },
      {
        id: 2,
        productId: 32,
        productName: "Trà Oolong Đặc Biệt",
        image:
          "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=900&auto=format&fit=crop",
        quantity: 1,
        price: 155000,
      },
    ],
  },
  {
    id: 1011,
    userId: 13,
    userName: "Lê Thu Hà",
    email: "thuha@gmail.com",
    phone: "0912233445",
    shippingAddress: "88 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    totalAmount: 520000,
    status: "confirmed",
    created_at: "2026-03-23T09:15:00.000Z",
    updated_at: "2026-03-23T11:30:00.000Z",
    payment: {
      method: "vnpay",
      status: "pending",
      transactionId: "VNP-928321",
    },
    orderDetails: [
      {
        id: 3,
        productId: 29,
        productName: "Trà Shan Tuyết",
        image:
          "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=900&auto=format&fit=crop",
        quantity: 4,
        price: 130000,
      },
    ],
  },
  {
    id: 1010,
    userId: 18,
    userName: "Phạm Đức Long",
    email: "duclong@gmail.com",
    phone: "0933555777",
    shippingAddress: "2 Lê Lợi, Quận 1, TP.HCM",
    totalAmount: 275000,
    status: "shipping",
    created_at: "2026-03-22T12:10:00.000Z",
    updated_at: "2026-03-23T08:40:00.000Z",
    payment: {
      method: "momo",
      status: "success",
      transactionId: "MOMO-81273",
    },
    orderDetails: [
      {
        id: 4,
        productId: 20,
        productName: "Trà Lài Premium",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop",
        quantity: 1,
        price: 95000,
      },
      {
        id: 5,
        productId: 21,
        productName: "Hộp Quà Trà Xuân",
        image:
          "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?q=80&w=900&auto=format&fit=crop",
        quantity: 1,
        price: 180000,
      },
    ],
  },
  {
    id: 1009,
    userId: 9,
    userName: "Trần Quỳnh",
    email: "quynh@gmail.com",
    phone: "0909888777",
    shippingAddress: "15 Trần Phú, Hải Phòng",
    totalAmount: 690000,
    status: "delivered",
    created_at: "2026-03-21T06:45:00.000Z",
    updated_at: "2026-03-22T16:45:00.000Z",
    payment: {
      method: "zalopay",
      status: "success",
      transactionId: "ZLP-00313",
    },
    orderDetails: [
      {
        id: 6,
        productId: 24,
        productName: "Set Trà Tết",
        image:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=900&auto=format&fit=crop",
        quantity: 3,
        price: 230000,
      },
    ],
  },
  {
    id: 1008,
    userId: 10,
    userName: "Vũ Thành Nam",
    email: "thanhnam@gmail.com",
    phone: "0977888999",
    shippingAddress: "9 Điện Biên Phủ, Đà Nẵng",
    totalAmount: 180000,
    status: "cancelled",
    created_at: "2026-03-20T05:05:00.000Z",
    updated_at: "2026-03-20T05:45:00.000Z",
    payment: {
      method: "cod",
      status: "refunded",
      transactionId: null,
    },
    orderDetails: [
      {
        id: 7,
        productId: 11,
        productName: "Trà Gừng Mật Ong",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop",
        quantity: 2,
        price: 90000,
      },
    ],
  },
];

const currency = new Intl.NumberFormat("vi-VN");

const statusClasses: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  shipping: "border-purple-200 bg-purple-50 text-purple-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: "COD",
  vnpay: "VNPay",
  momo: "MoMo",
  zalopay: "ZaloPay",
};

export default function OrderLayout() {
  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(mockOrders[0] ?? null);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((item) => item.status === "pending").length,
      delivered: orders.filter((item) => item.status === "delivered").length,
      revenue: orders
        .filter((item) => item.status !== "cancelled")
        .reduce((sum, item) => sum + item.totalAmount, 0),
    };
  }, [orders]);

  const handleView = (order: OrderItem) => {
    setSelectedOrder(order);
  };

  const handleDelete = (id: number) => {
    const found = orders.find((item) => item.id === id);
    if (!found) return;

    const confirmed = window.confirm(`Bạn có chắc muốn hủy / xóa đơn #${id} không?`);
    if (!confirmed) return;

    setOrders((prev) => prev.filter((item) => item.id !== id));
    setSelectedOrder((prev) => (prev?.id === id ? null : prev));
  };

  const handleChangeStatus = (id: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      )
    );

    setSelectedOrder((prev) =>
      prev?.id === id ? { ...prev, status, updated_at: new Date().toISOString() } : prev
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">Trang quản trị đơn hàng</p>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý đơn hàng</h1>
            
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng đơn</p>
              <p className="mt-1 text-lg font-semibold">{stats.total}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Chờ xác nhận</p>
              <p className="mt-1 text-lg font-semibold">{stats.pending}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Đã giao</p>
              <p className="mt-1 text-lg font-semibold">{stats.delivered}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Doanh thu</p>
              <p className="mt-1 text-lg font-semibold">{currency.format(stats.revenue)} đ</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.4fr_0.95fr]">
        <OrderList
          orders={orders.map((order) => ({
            id: order.id,
            customerName: order.userName,
            email: order.email,
            phone: order.phone || "",
            itemCount: order.orderDetails.reduce((sum, item) => sum + item.quantity, 0),
            paymentMethod: order.payment.method,
            paymentStatus: order.payment.status,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: new Date(order.created_at).toLocaleDateString("vi-VN"),
          }))}
          selectedId={selectedOrder?.id}
          onSelect={(item) => {
            const found = orders.find((o) => o.id === item.id);
            if (found) handleView(found);
          }}
          onDelete={(item) => handleDelete(item.id)}
          onStatusChange={(item, status) => handleChangeStatus(item.id, status)}
        />

        <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-n-500">Chi tiết đơn hàng</p>
              <h2 className="mt-1 text-2xl font-bold text-n-800">
                {selectedOrder ? `#${selectedOrder.id}` : "Chưa chọn đơn"}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-800">
              <Eye className="h-6 w-6" />
            </div>
          </div>

          {!selectedOrder ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-p-200 bg-p-50/60 px-4 py-12 text-center text-sm text-n-500">
              Chọn icon mắt ở bảng bên trái để xem chi tiết đơn hàng.
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[selectedOrder.status]}`}
                >
                  {selectedOrder.status}
                </span>

                <span className="inline-flex rounded-full border border-p-100 bg-p-50 px-3 py-1 text-xs font-semibold text-n-700">
                  {paymentMethodLabel[selectedOrder.payment.method]}
                </span>

                <span className="inline-flex rounded-full border border-p-100 bg-p-50 px-3 py-1 text-xs font-semibold text-n-700">
                  Payment: {selectedOrder.payment.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Khách hàng</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">{selectedOrder.userName}</p>
                  <p className="mt-1 text-sm text-n-500">{selectedOrder.email}</p>
                </div>

                <div className="rounded-2xl bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Liên hệ</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">
                    {selectedOrder.phone || "Chưa có số điện thoại"}
                  </p>
                  <p className="mt-1 text-sm text-n-500">
                    Cập nhật:{" "}
                    {new Date(selectedOrder.updated_at).toLocaleString("vi-VN")}
                  </p>
                </div>

                <div className="rounded-2xl bg-p-50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Địa chỉ giao hàng</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">
                    {selectedOrder.shippingAddress || "Chưa có địa chỉ"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-p-100 bg-white">
                <div className="flex items-center justify-between border-b border-p-100 px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-p-800" />
                    <p className="text-sm font-semibold text-n-800">Danh sách sản phẩm</p>
                  </div>

                  <p className="text-sm font-semibold text-p-900">
                    {currency.format(selectedOrder.totalAmount)} đ
                  </p>
                </div>

                <div className="divide-y divide-p-100">
                  {selectedOrder.orderDetails.map((detail) => (
                    <div key={detail.id} className="flex items-center gap-3 px-4 py-4">
                      <img
                        src={detail.image}
                        alt={detail.productName}
                        className="h-16 w-16 rounded-2xl border border-p-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-n-800">{detail.productName}</p>
                        <p className="mt-1 text-sm text-n-500">
                          SL: {detail.quantity} x {currency.format(detail.price)} đ
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-n-800">
                        {currency.format(detail.quantity * detail.price)} đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-p-100 bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Mã đơn</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">#{selectedOrder.id}</p>
                </div>

                <div className="rounded-2xl border border-p-100 bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Tổng sản phẩm</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">
                    {selectedOrder.orderDetails.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>

                <div className="rounded-2xl border border-p-100 bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Thanh toán</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800">
                    {selectedOrder.payment.transactionId || "Không có mã GD"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}