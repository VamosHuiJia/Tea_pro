import { useEffect, useState } from "react";
import { Eye, Pencil, Search, ShieldCheck, Trash2, WalletCards, Plus } from "lucide-react";
import type { PaymentItem, PaymentStatus, PaymentMethodKey } from "./PaymentLayout";

type PaymentListProps = {
  items?: PaymentItem[];
  searchTerm?: string;
  statusFilter?: "all" | PaymentStatus;
  onSearchChange?: (value: string) => void;
  onStatusFilterChange?: (value: "all" | PaymentStatus) => void;
  selectedId?: number;
  onCreate?: () => void;
  onView?: (payment: PaymentItem) => void;
  onEdit?: (payment: PaymentItem) => void;
  onDelete?: (id: number) => void;
  className?: string;
};

const statusOptions: PaymentStatus[] = ["pending", "success", "failed", "refunded"];

const methodLabel: Record<PaymentMethodKey, string> = {
  cod: "COD",
  vnpay: "VNPAY",
  momo: "MOMO",
  zalopay: "ZaloPay",
};

const methodBadge: Record<PaymentMethodKey, string> = {
  cod: "border-amber-200 bg-amber-50 text-amber-700",
  vnpay: "border-sky-200 bg-sky-50 text-sky-700",
  momo: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  zalopay: "border-violet-200 bg-violet-50 text-violet-700",
};

const channelStatusBadge: Record<"active" | "inactive", string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-700",
};

const resultStatusBadge: Record<PaymentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  refunded: "border-slate-200 bg-slate-100 text-slate-700",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PaymentList({
  items = [],
  searchTerm = "",
  statusFilter = "all",
  onSearchChange,
  onStatusFilterChange,
  selectedId,
  onCreate,
  onView,
  onEdit,
  onDelete,
  className,
}: PaymentListProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<number | undefined>(selectedId);

  useEffect(() => {
    setInternalSelectedId(selectedId);
  }, [selectedId]);

  return (
    <section
      className={cn(
        "flex min-h-[680px] w-full flex-col overflow-hidden rounded-[30px] border border-p-100 bg-white p-6 shadow-[0_18px_50px_rgba(6,40,32,0.06)] md:p-7",
        className,
      )}
    >
      <div className="flex flex-col gap-5 border-b border-p-100 pb-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium text-n-500">Danh sách phương thức</p>
          </div>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-p-900 px-5 text-sm font-semibold text-white transition hover:bg-p-700"
          >
            <Plus className="h-5 w-5" />
            Thêm mới
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-n-500" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Tìm theo tên, method, mô tả..."
              className="h-14 w-full rounded-2xl border border-p-100 bg-p-50 pl-12 pr-4 text-sm text-n-800 outline-none transition focus:border-p-400 focus:bg-white"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange?.(event.target.value as "all" | PaymentStatus)}
            className="h-14 rounded-2xl border border-p-100 bg-white px-4 text-sm text-n-700 outline-none transition focus:border-p-400"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-p-100 bg-white">
        <div className="max-h-[560px] min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1100px] table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-p-50">
              <tr>
                {[
                  "Phương thức",
                  "Method",
                  "Trạng thái",
                  "Phí (%)",
                  "Sắp xếp",
                  "Cập nhật",
                  "Hành động",
                ].map((label) => (
                  <th
                    key={label}
                    className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-n-500">
                    Không có phương thức thanh toán phù hợp.
                  </td>
                </tr>
              ) : (
                items.map((payment) => {
                  const isActiveRow = internalSelectedId === payment.id;

                  return (
                    <tr
                      key={payment.id}
                      className={cn(
                        "transition hover:bg-p-50/70",
                        isActiveRow && "bg-p-50/80",
                      )}
                    >
                      <td className="border-b border-p-100 px-4 py-4 align-top">
                        <div className="space-y-1.5 pr-3">
                          <p className="break-words text-[15px] font-semibold text-n-800">
                            {payment.name}
                          </p>
                          <p className="break-words text-[13px] leading-5 text-n-500">
                            {payment.description}
                          </p>
                        </div>
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                            methodBadge[payment.method],
                          )}
                        >
                          <WalletCards className="h-3.5 w-3.5" />
                          {methodLabel[payment.method]}
                        </span>
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                              resultStatusBadge[payment.status] || "border-slate-200 bg-slate-100 text-slate-700",
                            )}
                          >
                            {payment.status}
                          </span>

                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                              payment.isActive ? channelStatusBadge.active : channelStatusBadge.inactive
                            )}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {payment.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top text-[15px] font-semibold text-n-700">
                        {payment.feePercent}%
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top text-[15px] font-semibold text-n-700">
                        {payment.sortOrder}
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top text-[13px] font-medium text-n-600">
                        {new Date(payment.updated_at).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="border-b border-p-100 px-4 py-4 align-top">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInternalSelectedId(payment.id);
                              onView?.(payment);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-p-100 bg-p-50 text-n-600 transition hover:border-p-300 hover:bg-white hover:text-p-700"
                            aria-label={`Xem ${payment.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit?.(payment)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-p-100 bg-white text-n-600 transition hover:border-p-300 hover:bg-p-50 hover:text-p-700"
                            aria-label={`Sửa ${payment.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (internalSelectedId === payment.id) setInternalSelectedId(undefined);
                              onDelete?.(payment.id);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:border-rose-200 hover:bg-rose-100"
                            aria-label={`Xóa ${payment.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
            Hiển thị <span className="font-semibold text-n-700">{items.length}</span> phương thức.
          </p>
        </div>
      </div>
    </section>
  );
}