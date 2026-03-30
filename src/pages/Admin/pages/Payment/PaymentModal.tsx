import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  QrCode,
  Save,
  Wallet,
  X,
} from "lucide-react";
import type { PaymentFormValues, PaymentItem, PaymentMethodKey, PaymentStatus } from "./PaymentLayout";

type PaymentModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData: PaymentItem | null;
  onClose: () => void;
  onSubmit: (values: PaymentFormValues) => void;
};

const defaultValues: PaymentFormValues = {
  name: "",
  method: "cod",
  status: "pending",
  description: "",
  isActive: true,
  feePercent: 0,
  sortOrder: 1,
  transactionPrefix: "",
  image: null,
  qrCodeUrl: null,
};

const methodPreview: Record<
  PaymentMethodKey,
  { label: string; icon: typeof CreditCard; className: string }
> = {
  cod: {
    label: "COD",
    icon: Wallet,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  vnpay: {
    label: "VNPay",
    icon: CreditCard,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  momo: {
    label: "MoMo",
    icon: Wallet,
    className: "border-pink-200 bg-pink-50 text-pink-700",
  },
  zalopay: {
    label: "ZaloPay",
    icon: QrCode,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

const statusList: PaymentStatus[] = ["pending", "success", "failed", "refunded"];

export default function PaymentModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [form, setForm] = useState<PaymentFormValues>(defaultValues);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name,
        method: initialData.method,
        status: initialData.status,
        description: initialData.description,
        isActive: initialData.isActive,
        feePercent: initialData.feePercent,
        sortOrder: initialData.sortOrder,
        transactionPrefix: initialData.transactionPrefix,
        qrCodeUrl: initialData.qrCodeUrl,
        image: null,
      });
    } else {
      setForm(defaultValues);
    }
  }, [open, initialData]);

  const previewMeta = useMemo(() => methodPreview[form.method], [form.method]);
  const PreviewIcon = previewMeta.icon;

  const handleChange = <K extends keyof PaymentFormValues>(
    key: K,
    value: PaymentFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      window.alert("Vui lòng nhập tên phương thức thanh toán.");
      return;
    }

    if (!form.transactionPrefix.trim()) {
      window.alert("Vui lòng nhập prefix giao dịch.");
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      transactionPrefix: form.transactionPrefix.trim().toUpperCase(),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-n-800/45 px-4 py-6 backdrop-blur-[3px]">
      <div className="relative max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 shadow-sm transition hover:bg-p-50"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[95vh] overflow-y-auto lg:grid-cols-[1.35fr_0.9fr]">
          <div className="p-5 md:p-7">
            
            <h2 className="mt-1 text-2xl font-bold text-n-800">
              {mode === "create" ? "Thêm mới phương thức thanh toán" : `Cập nhật ${initialData?.name ?? ""}`}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">Tên hiển thị</label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ví dụ: VNPay QR / ATM / Visa"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-n-700">Phương thức</label>
                <select
                  value={form.method}
                  onChange={(e) => handleChange("method", e.target.value as PaymentMethodKey)}
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                >
                  <option value="cod">cod</option>
                  <option value="vnpay">vnpay</option>
                  <option value="momo">momo</option>
                  <option value="zalopay">zalopay</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-n-700">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value as PaymentStatus)}
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                >
                  {statusList.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-n-700">Phí giao dịch (%)</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.feePercent}
                  onChange={(e) => handleChange("feePercent", Number(e.target.value))}
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-n-700">Thứ tự ưu tiên</label>
                <input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(e) => handleChange("sortOrder", Number(e.target.value))}
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">Prefix giao dịch</label>
                <input
                  value={form.transactionPrefix}
                  onChange={(e) => handleChange("transactionPrefix", e.target.value)}
                  placeholder="Ví dụ: VNP, MOMO, ZLP..."
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm uppercase text-n-800 outline-none transition focus:border-p-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">Mô tả</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Mô tả ngắn về phương thức thanh toán..."
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">Ảnh QR / Logo (Tùy chọn)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleChange("image", file);
                  }}
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm text-n-800 outline-none transition focus:border-p-400 file:mr-4 file:rounded-xl file:border file:border-p-200 file:bg-p-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-n-700 hover:file:bg-p-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 rounded-2xl border border-p-100 bg-p-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="h-4 w-4 rounded border-p-200"
                  />
                  <span className="text-sm font-semibold text-n-700">
                    Hiển thị phương thức này ở trang thanh toán
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-p-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-p-200 bg-white px-5 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
              >
                <Save className="h-4 w-4" />
                {mode === "create" ? "Thêm mới" : "Cập nhật"}
              </button>
            </div>
          </div>

          <div className="border-t border-p-100 bg-p-50/50 p-5 lg:border-l lg:border-t-0 md:p-7">
            <p className="text-sm font-medium text-n-500">Xem trước</p>

            <div className="mt-4 rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${previewMeta.className}`}
                  >
                    <PreviewIcon className="h-4 w-4" />
                    {previewMeta.label}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-n-800">
                    {form.name || "Tên phương thức"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-n-500">
                    {form.description || "Mô tả ngắn của phương thức sẽ hiển thị ở đây."}
                  </p>

                  {(form.image || form.qrCodeUrl) && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-p-100">
                      <img 
                        src={form.image ? URL.createObjectURL(form.image) : form.qrCodeUrl!} 
                        alt="QR Code Preview" 
                        className="h-32 w-32 object-cover object-center"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-p-50 p-4">
                  <p className="text-xs text-n-500">Trạng thái</p>
                  <p className="mt-1 text-sm font-semibold text-n-800">{form.status}</p>
                </div>

                <div className="rounded-2xl bg-p-50 p-4">
                  <p className="text-xs text-n-500">Hoạt động</p>
                  <p className="mt-1 text-sm font-semibold text-n-800">
                    {form.isActive ? "Đang bật" : "Đang tắt"}
                  </p>
                </div>

                <div className="rounded-2xl bg-p-50 p-4">
                  <p className="text-xs text-n-500">Phí giao dịch</p>
                  <p className="mt-1 text-sm font-semibold text-n-800">{form.feePercent}%</p>
                </div>

                <div className="rounded-2xl bg-p-50 p-4">
                  <p className="text-xs text-n-500">Prefix</p>
                  <p className="mt-1 text-sm font-semibold uppercase text-n-800">
                    {form.transactionPrefix || "---"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}