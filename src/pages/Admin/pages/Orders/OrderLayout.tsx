import { useEffect, useMemo, useState } from "react";
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
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../../../api/admin/order.api";
import { useToast } from "../../../../contexts/ToastContext";
import { useConfirm } from "../../../../contexts/ConfirmContext";

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

const currency = new Intl.NumberFormat("vi-VN");

const statusClasses: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  shipping: "border-purple-200 bg-purple-50 text-purple-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentMethodLabel: Record<string, string> = {
  cod: "COD",
  vnpay: "VNPay",
  momo: "MoMo",
  zalopay: "ZaloPay",
};

export default function OrderLayout() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      const mappedOrders: OrderItem[] = data.map((o: any) => ({
        id: o.id,
        userId: o.userId,
        userName: o.user?.fullName || o.user?.username || "Khách",
        email: o.user?.email || "",
        phone: o.phone || "",
        shippingAddress: o.shippingAddress,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        created_at: o.created_at,
        updated_at: o.updated_at,
        payment: {
          method: o.payment?.method || "cod",
          status: o.payment?.status || "pending",
          transactionId: o.payment?.transactionId || null,
        },
        orderDetails: (o.orderDetails || []).map((d: any) => ({
          id: d.id,
          productId: d.productId,
          productName: d.product?.name || "Sản phẩm",
          image: d.product?.image_url || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop",
          quantity: Number(d.quantity),
          price: Number(d.price),
        }))
      }));

      setOrders(mappedOrders);
      if (mappedOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(mappedOrders[0]);
      } else if (selectedOrder) {
        const updated = mappedOrders.find(o => o.id === selectedOrder.id);
        setSelectedOrder(updated || null);
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Lỗi tải đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleDelete = async (id: number) => {
    const confirmed = await confirm(`Bạn có chắc muốn hủy / xóa đơn #${id} không?`);
    if (!confirmed) return;

    try {
      await deleteOrder(id);
      showToast("Xóa đơn hàng thành công", "success");
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
      await fetchOrders();
    } catch (e: any) {
      showToast(e.message || "Lỗi xóa đơn", "error");
    }
  };

  const handleChangeStatus = async (id: number, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      showToast(`Đã chuyển đơn hàng sang trạng thái: ${status}`, "success");
      await fetchOrders();
    } catch (e: any) {
      showToast(e.message || "Lỗi cập nhật", "error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
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
        {loading && orders.length === 0 ? (
           <div className="h-64 flex items-center justify-center bg-white rounded-[28px] border border-p-100">
               <p className="text-n-500 font-medium">Đang tải danh sách đơn hàng...</p>
           </div>
        ) : (
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
        )}

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
              {loading ? "Đang tải dữ liệu..." : "Chọn icon mắt ở bảng bên trái để xem chi tiết đơn hàng."}
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
                  {paymentMethodLabel[selectedOrder.payment.method] || selectedOrder.payment.method}
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
                  {(!selectedOrder.orderDetails || selectedOrder.orderDetails.length === 0) && (
                    <div className="p-4 text-center text-sm text-n-500">
                      Không có sản phẩm nào
                    </div>
                  )}
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
                    {selectedOrder.orderDetails?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-p-100 bg-p-50 p-4">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-p-800" />
                    <p className="text-xs text-n-500">Thanh toán</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-n-800 truncate">
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