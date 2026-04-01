import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  BadgeCheck,
  ImagePlus,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type { EmployeeItem } from "./EmployeeList";

export type EmployeeFormValues = {
  id?: string | number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar_url: string;
  roleName: string;
  roleLevel: "staff" | "admin";
  created_at?: string;
  updated_at?: string;
};

type EmployeeModalProps = {
  open: boolean;
  mode: "create" | "edit" | "delete";
  initialData?: EmployeeItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  onConfirmDelete: (employee: EmployeeItem) => void;
};

const defaultValues: EmployeeFormValues = {
  username: "",
  fullName: "",
  email: "",
  phone: "",
  avatar_url: "",
  roleName: "Nhân viên bán hàng",
  roleLevel: "staff",
};

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getInitials(name?: string) {
  return String(name || "NV")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
}

export default function EmployeeModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
  onConfirmDelete,
}: EmployeeModalProps) {
  const [form, setForm] = useState<EmployeeFormValues>(defaultValues);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;

    if ((mode === "edit" || mode === "delete") && initialData) {
      setForm({
        id: initialData.id,
        username: initialData.username || "",
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        avatar_url: initialData.avatar_url || "",
        roleName: initialData.roleName || "Nhân viên",
        roleLevel: initialData.roleLevel,
        created_at: initialData.created_at,
        updated_at: initialData.updated_at,
      });
      return;
    }

    setForm(defaultValues);
  }, [open, mode, initialData]);

  const title = useMemo(() => {
    if (mode === "create") return "Thêm mới nhân viên";
    if (mode === "edit") return "Cập nhật nhân viên";
    return "Xóa nhân viên";
  }, [mode]);

  if (!open) return null;

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, avatar_url: base64 }));
  };

  const handleDropImage = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, avatar_url: base64 }));
  };

  const handleSubmit = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.username.trim()) return;

    onSubmit({
      ...form,
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      roleName: form.roleName.trim() || "Nhân viên",
    });
  };

  if (mode === "delete" && initialData) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-n-800/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-[36px] border border-p-100 bg-white p-6 shadow-2xl md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-n-500">Xác nhận thao tác</p>
              <h2 className="text-2xl font-bold text-n-800">Xóa nhân viên</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 transition hover:bg-p-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 rounded-[28px] border border-rose-100 bg-rose-50 p-5">
            <div className="flex items-center gap-4">
              {initialData.avatar_url ? (
                <img
                  src={initialData.avatar_url}
                  alt={initialData.fullName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-lg font-bold text-rose-700">
                  {getInitials(initialData.fullName)}
                </div>
              )}

              <div>
                <p className="text-lg font-bold text-n-800">{initialData.fullName}</p>
                <p className="text-sm text-n-500">{initialData.email}</p>
                <p className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-700">
                  {initialData.roleName || "Nhân viên"} · {initialData.roleLevel}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-p-200 bg-white px-5 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={() => onConfirmDelete(initialData)}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-600 bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-n-800/60 p-4 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[36px] border border-p-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-p-100 px-5 py-4 md:px-7">
          <div>
            <p className="text-sm font-medium text-n-500">Biểu mẫu nhân viên</p>
            <h2 className="text-xl font-bold text-n-800 md:text-2xl">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 transition hover:bg-p-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid max-h-[calc(94vh-81px)] grid-cols-1 overflow-y-auto xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 p-5 md:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Họ tên</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  placeholder="Nhập họ tên nhân viên"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Tên đăng nhập</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                  placeholder="Nhập username"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="Nhập email nhân viên"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="Nhập số điện thoại"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Chức vụ hiển thị</label>
                <input
                  type="text"
                  value={form.roleName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, roleName: event.target.value }))
                  }
                  placeholder="Ví dụ: Quản lý cửa hàng"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">Quyền hạn (RoleLevel)</label>
                <select
                  value={form.roleLevel}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      roleLevel: event.target.value as "staff" | "admin",
                    }))
                  }
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                >
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="xl:col-span-12">
                <label className="mb-2 block text-sm font-semibold text-n-700">Ảnh đại diện</label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-p-200 bg-p-50 px-4 py-3 text-sm font-semibold text-p-700 transition hover:bg-p-100"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Chọn ảnh đại diện
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />

                  <input
                    type="text"
                    value={form.avatar_url}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, avatar_url: event.target.value }))
                    }
                    placeholder="Hoặc dán URL ảnh đại diện"
                    className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-p-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-p-200 bg-white px-5 py-3 text-sm font-semibold text-n-700 transition hover:bg-p-50"
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {loading ? "Đang lưu..." : mode === "create" ? "Thêm mới" : "Cập nhật"}
              </button>
            </div>
          </div>

          <div className="border-t border-p-100 bg-[linear-gradient(180deg,rgba(238,251,245,0.65)_0%,rgba(255,255,255,1)_100%)] p-5 xl:border-l xl:border-t-0 md:p-7">
            <p className="text-sm font-medium text-n-500">Xem trước thông tin</p>

            <div className="mt-4 overflow-hidden rounded-[30px] border border-p-100 bg-white shadow-sm">
              <div className="relative flex min-h-[260px] items-center justify-center bg-p-50">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt={form.fullName || "Employee preview"}
                    className="h-full min-h-[260px] w-full object-cover"
                  />
                ) : (
                  <label
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDropImage}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex h-[260px] w-full cursor-pointer items-center justify-center border-2 border-dashed transition ${
                      dragging ? "border-p-500 bg-p-50" : "border-p-200 bg-p-50/60"
                    }`}
                  >
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-10 w-10 text-p-700" />
                      <p className="mt-3 text-sm font-medium text-n-600">
                        Kéo & thả hoặc nhấn để thêm ảnh đại diện
                      </p>
                    </div>
                  </label>
                )}

                <div className="absolute left-4 top-4">
                  <span
                    className={`rounded-full border border-white/30 bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                      form.roleLevel === "admin" ? "text-violet-700" : "text-emerald-700"
                    }`}
                  >
                    RoleLevel: {form.roleLevel}
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-p-100 text-lg font-bold text-p-700">
                    {getInitials(form.fullName)}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-n-800">
                      {form.fullName || "Họ tên nhân viên"}
                    </h3>
                    <p className="mt-1 text-sm text-n-500">@{form.username || "username"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                    <div className="flex items-center gap-2 text-sky-700">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Email</span>
                    </div>
                    <p className="mt-2 font-semibold text-sky-800">{form.email || "example@gmail.com"}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Số điện thoại</span>
                    </div>
                    <p className="mt-2 font-semibold text-amber-800">{form.phone || "Chưa cập nhật"}</p>
                  </div>

                  <div className="rounded-2xl border border-p-100 bg-p-50 p-4">
                    <div className="flex items-center gap-2 text-p-700">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Chức vụ hiển thị</span>
                    </div>
                    <p className="mt-2 font-semibold text-p-800">{form.roleName || "Nhân viên"}</p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-4 text-sm ${
                    form.roleLevel === "admin"
                      ? "border border-violet-100 bg-violet-50 text-violet-700"
                      : "border border-emerald-100 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {form.roleLevel === "admin" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                    Quyền hiện tại: {form.roleLevel}
                  </div>
                  <p className="mt-2 leading-7">
                    Ở màn hình nhân viên, người quản lý có thể chọn RoleLevel là staff hoặc admin ngay tại form.
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
