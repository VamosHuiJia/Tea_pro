import { Download, FileEdit, Plus, Trash2, Upload } from "lucide-react";
import PermissionGate from "../../../../components/PermissionGate";

export type CategoryItem = {
  id: string | number;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
};

type CategoryListProps = {
  categories: CategoryItem[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
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

function EmptyState({
  onAdd,
  onImportExcel,
}: {
  onAdd: () => void;
  onImportExcel: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-p-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-p-50 text-p-700">
        <Plus className="h-8 w-8" />
      </div>

      <h3 className="mt-4 text-xl font-bold text-n-800">
        Chưa có danh mục nào
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm text-n-500">
        Bạn có thể thêm mới hoặc nhập Excel để bắt đầu quản lý danh sách danh mục.
      </p>

      <PermissionGate>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
          >
            <Plus className="h-4 w-4" />
            Thêm mới danh mục
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

export default function CategoryList({
  categories,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onImportExcel,
  onExportExcel,
}: CategoryListProps) {
  if (loading) {
    return (
      <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-p-50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return <EmptyState onAdd={onAdd} onImportExcel={onImportExcel} />;
  }

  return (
    <section className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-[28px] border border-p-100 bg-white p-4 shadow-[0_18px_50px_rgba(6,40,32,0.06)] md:p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-n-500">Danh sách danh mục</p>
          <h3 className="text-xl font-bold text-n-800">Quản lý danh mục sản phẩm</h3>
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
          <table className="min-w-[1100px] w-full table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-p-50">
              <tr>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Hình ảnh</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tên danh mục</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tiêu đề</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Mô tả</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Trạng thái</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tạo lúc</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Cập nhật lúc</th>
                <PermissionGate>
                  <th className="border-b border-p-100 px-4 py-3.5 text-center text-sm font-semibold text-n-500">Hành động</th>
                </PermissionGate>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="transition hover:bg-p-50/70">
                  <td className="border-b border-p-100 px-4 py-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-14 w-14 rounded-2xl border border-p-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-p-200 bg-white text-xs font-semibold text-n-500">
                        No img
                      </div>
                    )}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 font-semibold text-n-800">
                    <p className="break-words">{category.name}</p>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 font-semibold text-n-800">
                    <p className="break-words">{category.title || "--"}</p>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4">
                    <p className="line-clamp-2 max-w-[280px] text-sm text-n-600">
                      {category.description || "--"}
                    </p>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${category.isActive
                          ? "border border-p-200 bg-p-100 text-p-700"
                          : "border border-rose-200 bg-rose-100 text-rose-700"
                        }`}
                    >
                      {category.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 text-sm text-n-600">
                    {formatDateTime(category.created_at)}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 text-sm text-n-600">
                    {formatDateTime(category.updated_at)}
                  </td>

                  <PermissionGate>
                    <td className="border-b border-p-100 px-4 py-4">
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
                          onClick={() => onEdit(category)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                          title="Sửa"
                        >
                          <FileEdit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(category)}
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