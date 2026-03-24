import { useEffect, useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "vnpay" | "momo" | "zalopay";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type OrderListItem = {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  itemCount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

type OrderListProps = {
  orders?: OrderListItem[];
  selectedId?: number;
  onSelect?: (order: OrderListItem) => void;
  onStatusChange?: (order: OrderListItem, status: OrderStatus) => void;
  onDelete?: (order: OrderListItem) => void;
  className?: string;
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

const defaultOrders: OrderListItem[] = [
  {
    id: 1012,
    customerName: "Nguyễn Minh Anh",
    email: "minhanh@gmail.com",
    phone: "0987654321",
    itemCount: 3,
    paymentMethod: "cod",
    paymentStatus: "success",
    totalAmount: 345000,
    status: "pending",
    createdAt: "24/03/2026",
  },
  {
    id: 1011,
    customerName: "Lê Thu Hà",
    email: "thuha@gmail.com",
    phone: "0912456789",
    itemCount: 4,
    paymentMethod: "vnpay",
    paymentStatus: "pending",
    totalAmount: 520000,
    status: "confirmed",
    createdAt: "23/03/2026",
  },
  {
    id: 1010,
    customerName: "Phạm Quang Huy",
    email: "quanghuy@gmail.com",
    phone: "0966123456",
    itemCount: 2,
    paymentMethod: "momo",
    paymentStatus: "success",
    totalAmount: 180000,
    status: "shipping",
    createdAt: "22/03/2026",
  },
  {
    id: 1009,
    customerName: "Vũ Khánh Linh",
    email: "khanhlinh@gmail.com",
    phone: "0933555777",
    itemCount: 5,
    paymentMethod: "zalopay",
    paymentStatus: "success",
    totalAmount: 785000,
    status: "delivered",
    createdAt: "21/03/2026",
  },
  {
    id: 1008,
    customerName: "Hoàng Gia Bảo",
    email: "giabao@gmail.com",
    phone: "0979123456",
    itemCount: 1,
    paymentMethod: "cod",
    paymentStatus: "failed",
    totalAmount: 95000,
    status: "cancelled",
    createdAt: "21/03/2026",
  },
  {
    id: 1007,
    customerName: "Đỗ Mai Phương",
    email: "maiphuong@gmail.com",
    phone: "0909001122",
    itemCount: 6,
    paymentMethod: "vnpay",
    paymentStatus: "success",
    totalAmount: 1280000,
    status: "delivered",
    createdAt: "20/03/2026",
  },
  {
    id: 1006,
    customerName: "Trần Nam Khánh",
    email: "namkhanh@gmail.com",
    phone: "0988111222",
    itemCount: 2,
    paymentMethod: "momo",
    paymentStatus: "refunded",
    totalAmount: 265000,
    status: "cancelled",
    createdAt: "19/03/2026",
  },
  {
    id: 1005,
    customerName: "Bùi Thanh Tâm",
    email: "thanhtam@gmail.com",
    phone: "0944666777",
    itemCount: 8,
    paymentMethod: "cod",
    paymentStatus: "success",
    totalAmount: 1630000,
    status: "confirmed",
    createdAt: "18/03/2026",
  },
];

const orderStatusBadge: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-sky-200 bg-sky-50 text-sky-700",
  shipping: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentStatusBadge: Record<PaymentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  refunded: "border-slate-200 bg-slate-100 text-slate-700",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: "COD",
  vnpay: "VNPAY",
  momo: "MOMO",
  zalopay: "ZaloPay",
};

const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "pending",
  confirmed: "confirmed",
  shipping: "shipping",
  delivered: "delivered",
  cancelled: "cancelled",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "pending",
  success: "success",
  failed: "failed",
  refunded: "refunded",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderList({
  orders = defaultOrders,
  selectedId,
  onSelect,
  onStatusChange,
  onDelete,
  className,
}: OrderListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [tableData, setTableData] = useState<OrderListItem[]>(orders);
  const [internalSelectedId, setInternalSelectedId] = useState<number | undefined>(selectedId);

  useEffect(() => {
    setTableData(orders);
  }, [orders]);

  useEffect(() => {
    setInternalSelectedId(selectedId);
  }, [selectedId]);

  const filteredOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return tableData.filter((order) => {
      const matchedKeyword =
        !keyword ||
        String(order.id).includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.email.toLowerCase().includes(keyword) ||
        order.phone.toLowerCase().includes(keyword);

      const matchedStatus = statusFilter === "all" || order.status === statusFilter;

      return matchedKeyword && matchedStatus;
    });
  }, [query, statusFilter, tableData]);

  return (
    <section
      className={cn(
        "flex min-h-[680px] w-full flex-col overflow-hidden rounded-[30px] border border-p-100 bg-white p-6 shadow-[0_18px_50px_rgba(6,40,32,0.06)] md:p-7",
        className,
      )}
    >
      <div className="flex flex-col gap-5 border-b border-p-100 pb-5">
        <div>
          <p className="text-sm font-medium text-n-500">Danh sách đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-n-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo mã đơn, tên khách, email, số điện thoại..."
              className="h-14 w-full rounded-2xl border border-p-100 bg-p-50 pl-12 pr-4 text-sm text-n-800 outline-none transition focus:border-p-400 focus:bg-white"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)}
            className="h-14 rounded-2xl border border-p-100 bg-white px-4 text-sm text-n-700 outline-none transition focus:border-p-400"
          >
            <option value="all">Tất cả trạng thái</option>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {orderStatusLabel[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-p-100 bg-white">
        <div className="max-h-[560px] min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-p-50">
              <tr>
                {[
                  "Đơn hàng",
                  "Khách hàng",
                  "Thanh toán",
                  "Tổng tiền",
                  "Trạng thái",
                  "Ngày tạo",
                  "Hành động",
                ].map((label) => (
                  <th
                    key={label}
                    className="border-b border-p-100 px-5 py-4 text-left text-[15px] font-semibold text-n-500"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-n-500">
                    Không có đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isActive = internalSelectedId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        "transition hover:bg-p-50/70",
                        isActive && "bg-p-50/80",
                      )}
                    >
                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <div className="space-y-2">
                          <p className="text-2xl font-bold tracking-tight text-n-800">#{order.id}</p>
                          <p className="text-sm leading-6 text-n-500">{order.itemCount} sản phẩm</p>
                        </div>
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <div className="space-y-2 pr-2">
                          <p className="text-lg font-semibold text-n-800 break-words">{order.customerName}</p>
                          <p className="text-sm leading-6 text-n-500 break-all">{order.email}</p>
                          <p className="text-sm leading-6 text-n-500">{order.phone}</p>
                        </div>
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <div className="space-y-3">
                          <p className="text-lg font-semibold uppercase text-n-800">{paymentMethodLabel[order.paymentMethod]}</p>
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                              paymentStatusBadge[order.paymentStatus],
                            )}
                          >
                            Payment: {paymentStatusLabel[order.paymentStatus]}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <p className="text-lg font-bold text-n-800">{formatCurrency(order.totalAmount)}</p>
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold capitalize",
                            orderStatusBadge[order.status],
                          )}
                        >
                          {orderStatusLabel[order.status]}
                        </span>
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top text-sm font-medium text-n-600">
                        {order.createdAt}
                      </td>

                      <td className="border-b border-p-100 px-5 py-5 align-top">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInternalSelectedId(order.id);
                              onSelect?.(order);
                            }}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-p-100 bg-p-50 text-n-600 transition hover:border-p-300 hover:bg-white hover:text-p-700"
                            aria-label={`Xem chi tiết đơn #${order.id}`}
                          >
                            <Eye className="h-5 w-5" />
                          </button>

                          <select
                            value={order.status}
                            onChange={(event) => {
                              const nextStatus = event.target.value as OrderStatus;
                              setTableData((current) =>
                                current.map((item) =>
                                  item.id === order.id ? { ...item, status: nextStatus } : item,
                                ),
                              );
                              onStatusChange?.(order, nextStatus);
                            }}
                            className="h-11 min-w-[138px] rounded-2xl border border-p-100 bg-white px-3 text-sm text-n-700 outline-none transition focus:border-p-400"
                          >
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {orderStatusLabel[status]}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setTableData((current) => current.filter((item) => item.id !== order.id));
                              if (internalSelectedId === order.id) setInternalSelectedId(undefined);
                              onDelete?.(order);
                            }}
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100"
                          >
                            Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-p-100 bg-white px-5 py-4 text-sm text-n-500 md:flex-row md:items-center md:justify-between">
          <p>
            Hiển thị <span className="font-semibold text-n-700">{filteredOrders.length}</span> / {tableData.length} đơn hàng.
          </p>
        </div>
      </div>
    </section>
  );
}
