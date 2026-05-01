import {
  Download,
  FileEdit,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";
import PermissionGate from "../../../../components/PermissionGate";

export type RoleLevel = "customer" | "staff" | "admin";

export type CustomerItem = {
  id: string | number;
  publicId?: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  roleName: string;
  roleLevel: RoleLevel;
  created_at?: string;
  updated_at?: string;
};

type CustomerListProps = {
  customers: CustomerItem[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (customer: CustomerItem) => void;
  onDelete: (customer: CustomerItem) => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
};

function formatDateTime(value?: string) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name?: string) {
  return String(name || "KH")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
}

function EmptyState({
  onAdd,
  onImportExcel,
}: {
  onAdd: () => void;
  onImportExcel: () => void;
}) {
  return (
    <div className="rounded-[32px] border border-dashed border-p-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-p-50 text-p-700 shadow-sm">
        <UserPlus className="h-9 w-9" />
      </div>

      <h3 className="mt-5 text-2xl font-bold text-n-800">
        Chưa có khách hàng nào trong hệ thống
      </h3>

      <p className="mx-auto mt-3 max-w-2xl text-sm text-n-500">
        Bạn có thể thêm mới khách hàng thủ công hoặc nhập danh sách từ Excel.
      </p>

      <PermissionGate>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
          >
            <Plus className="h-4 w-4" />
            Thêm mới khách hàng
          </button>

          <button
            type="button"
            onClick={onImportExcel}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Upload className="h-4 w-4" />
            Nhập Excel
          </button>
        </div>
      </PermissionGate>
    </div>
  );
}

export default function CustomerList({
  customers,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onImportExcel,
  onExportExcel,
}: CustomerListProps) {
  if (loading) {
    return (
      <div className="rounded-[32px] border border-p-100 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-18 animate-pulse rounded-2xl bg-p-50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!customers.length) {
    return <EmptyState onAdd={onAdd} onImportExcel={onImportExcel} />;
  }

  return (
    <section className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-[32px] border border-p-100 bg-white p-4 shadow-[0_18px_50px_rgba(6,40,32,0.06)] md:p-5">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-n-500">Danh sách khách hàng</p>
          <h3 className="text-xl font-bold text-n-800">Quản lý tài khoản khách hàng</h3>
        </div>

        <PermissionGate>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onImportExcel}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Upload className="h-4 w-4" />
              Nhập Excel
            </button>

            <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              <Download className="h-4 w-4" />
              Xuất tất cả Excel
            </button>

            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
            >
              <Plus className="h-4 w-4" />
              Thêm mới
            </button>
          </div>
        </PermissionGate>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-p-100 bg-white">
        <div className="max-h-[560px] min-h-0 flex-1 overflow-auto hide-scrollbar-y">
          <table className="min-w-[1400px] w-full table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-p-50">
              <tr>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Hình ảnh</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Họ tên</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Email</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Số điện thoại</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Chức vụ</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tạo lúc</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Cập nhật lúc</th>
                <PermissionGate>
                  <th className="border-b border-p-100 px-4 py-3.5 text-center text-sm font-semibold text-n-500">Hành động</th>
                </PermissionGate>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-p-50/70"
                >
                  <td className="border-b border-p-100 px-4 py-4">
                    {customer.avatar_url ? (
                      <img
                        src={customer.avatar_url}
                        alt={customer.fullName}
                        className="h-16 w-16 rounded-2xl border border-p-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-p-200 bg-p-50 text-sm font-semibold text-p-700">
                        {getInitials(customer.fullName)}
                      </div>
                    )}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="min-w-[220px]">
                      <p className="break-words font-semibold text-n-800">{customer.fullName}</p>
                      <p className="mt-1 text-xs text-n-500">@{customer.username}</p>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-sky-50 px-3 py-2 text-sky-700">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="break-all font-medium">{customer.email}</span>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-amber-700">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="break-words font-medium">{customer.phone || "--"}</span>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <span className="inline-flex rounded-full border border-p-200 bg-p-50 px-3 py-1 text-xs font-semibold text-p-700">
                      {customer.roleName || "Khách hàng"}
                    </span>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top text-sm text-n-600">
                    {formatDateTime(customer.created_at)}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top text-sm text-n-600">
                    {formatDateTime(customer.updated_at)}
                  </td>

                  <PermissionGate>
                    <td className="border-b border-p-100 px-4 py-4 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={onAdd}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-p-200 bg-white text-p-700 transition hover:bg-p-50"
                          title="Thêm mới"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(customer)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                          title="Sửa"
                        >
                          <FileEdit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(customer)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </PermissionGate>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}