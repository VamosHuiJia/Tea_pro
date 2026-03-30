import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CircleDollarSign,
  CreditCard,
  QrCode,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import PaymentList from "./PaymentList";
import PaymentModal from "./PaymentModal";
import { getAllPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "../../../../api/admin/payment.api";
import { useToast } from "../../../../contexts/ToastContext";

export type PaymentMethodKey = "cod" | "vnpay" | "momo" | "zalopay";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type PaymentFormValues = {
  name: string;
  method: PaymentMethodKey;
  status: PaymentStatus;
  description: string;
  isActive: boolean;
  feePercent: number;
  sortOrder: number;
  transactionPrefix: string;
  image?: File | null;
  qrCodeUrl?: string | null;
};

export type PaymentItem = {
  id: number;
  name: string;
  method: PaymentMethodKey;
  status: PaymentStatus;
  description: string;
  isActive: boolean;
  feePercent: number;
  sortOrder: number;
  transactionPrefix: string;
  qrCodeUrl: string | null;
  created_at: string;
  updated_at: string;
};

const currency = new Intl.NumberFormat("vi-VN");

const methodMeta: Record<
  string, // using string because custom methods might appear
  { label: string; icon: typeof CreditCard; badgeClass: string }
> = {
  cod: {
    label: "COD",
    icon: Banknote,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  vnpay: {
    label: "VNPay",
    icon: CreditCard,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  momo: {
    label: "MoMo",
    icon: Wallet,
    badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
  },
  zalopay: {
    label: "ZaloPay",
    icon: QrCode,
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
};

const defaultMeta = {
  label: "Method",
  icon: CircleDollarSign,
  badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function PaymentLayout() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [viewedPayment, setViewedPayment] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getAllPaymentMethods();
      setPayments(data.map((item: any) => ({
        ...item,
        feePercent: Number(item.feePercent)
      })));
    } catch (e: any) {
      showToast(e.message || "Lỗi tải phương thức thanh toán", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPayments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return payments.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.method.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.transactionPrefix.toLowerCase().includes(keyword);

      const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = payments.length;
    const active = payments.filter((item) => item.isActive).length;
    const pending = payments.filter((item) => item.status === "pending").length;
    const avgFee =
      total === 0
        ? 0
        : payments.reduce((sum, item) => sum + Number(item.feePercent || 0), 0) / total;

    return { total, active, pending, avgFee };
  }, [payments]);

  const featuredMethod = useMemo(() => {
    return [...payments].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  }, [payments]);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedPayment(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (item: PaymentItem) => {
    setMode("edit");
    setSelectedPayment(item);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    const found = payments.find((item) => item.id === id);
    if (!found) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa phương thức "${found.name}" không?`
    );
    if (!confirmed) return;

    try {
        await deletePaymentMethod(id);
        showToast("Xóa thành công", "success");
        await fetchPayments();
    } catch (e: any) {
        showToast(e.message || "Lỗi khi xóa", "error");
    }
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    try {
        if (mode === "create") {
            await createPaymentMethod(values);
            showToast("Thêm mới thành công", "success");
        } else if (selectedPayment) {
            await updatePaymentMethod(selectedPayment.id, values);
            showToast("Cập nhật thành công", "success");
            if (viewedPayment?.id === selectedPayment.id) setViewedPayment(null);
        }
        await fetchPayments();
        setOpenModal(false);
        setSelectedPayment(null);
    } catch (e: any) {
        showToast(e.message || "Lỗi khi lưu", "error");
    }
  };

  const displayMethod = viewedPayment || featuredMethod;
  const featuredMeta = displayMethod ? (methodMeta[displayMethod.method] || defaultMeta) : null;
  const FeaturedIcon = featuredMeta?.icon ?? CircleDollarSign;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">Trang quản trị thanh toán</p>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý Phương thức thanh toán</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Tải lại trang
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Tổng phương thức</p>
            <p className="mt-1 text-lg font-semibold">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Đang hoạt động</p>
            <p className="mt-1 text-lg font-semibold">{stats.active}</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Chờ xử lý</p>
            <p className="mt-1 text-lg font-semibold">{stats.pending}</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Phí trung bình</p>
            <p className="mt-1 text-lg font-semibold">{stats.avgFee.toFixed(1)}%</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <PaymentList
          items={filteredPayments}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          selectedId={viewedPayment?.id}
          onCreate={handleOpenCreate}
          onView={(item) => setViewedPayment(item)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <div className="space-y-6">
          <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-n-500">
                  {viewedPayment ? "Chi tiết phương thức" : "Ưu tiên hiển thị"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-n-800">
                  {displayMethod?.name ?? "Chưa có dữ liệu"}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-p-50 text-p-800">
                <FeaturedIcon className="h-6 w-6" />
              </div>
            </div>

            {displayMethod && featuredMeta ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${featuredMeta.badgeClass}`}
                  >
                    {featuredMeta.label}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Thứ tự {displayMethod.sortOrder}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-n-600">{displayMethod.description}</p>

                {displayMethod.qrCodeUrl && (
                  <div className="mt-4">
                    <p className="text-xs text-n-500 mb-2">Mã QR / Logo</p>
                    <img src={displayMethod.qrCodeUrl} alt="QR Code" className="w-32 h-32 object-cover rounded-xl border border-p-100" />
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-p-50 p-4">
                    <p className="text-xs text-n-500">Prefix giao dịch</p>
                    <p className="mt-1 text-base font-semibold text-n-800">
                      {displayMethod.transactionPrefix}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-p-50 p-4">
                    <p className="text-xs text-n-500">Phí áp dụng</p>
                    <p className="mt-1 text-base font-semibold text-n-800">
                      {displayMethod.feePercent}%
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-n-500">Chưa có phương thức nào để hiển thị.</p>
            )}
          </div>

          <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-n-500">Tổng phí giả lập</p>
            <h3 className="mt-1 text-2xl font-bold text-n-800">
              {currency.format(
                Math.round(payments.reduce((sum, item) => sum + item.feePercent * 100000, 0))
              )}{" "}
              đ
            </h3>
          </div>
        </div>
      </section>

      <PaymentModal
        open={openModal}
        mode={mode}
        initialData={selectedPayment}
        onClose={() => {
          setOpenModal(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}