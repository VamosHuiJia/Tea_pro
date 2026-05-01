import {
  BadgePercent,
  Boxes,
  Download,
  FileEdit,
  PackagePlus,
  Plus,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import PermissionGate from "../../../../components/PermissionGate";

export type ProductItem = {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  quantity: number;
  sold: number;
  categoryId: string | number;
  categoryName: string;
  brandId: string | number;
  brandName: string;
  originalPrice: number;
  discountPercent: number;
  currentPrice: number;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
};

type ProductListProps = {
  products: ProductItem[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
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

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
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
        <PackagePlus className="h-9 w-9" />
      </div>

      <h3 className="mt-5 text-2xl font-bold text-n-800">
        Chưa có sản phẩm nào trong hệ thống
      </h3>

      <p className="mx-auto mt-3 max-w-2xl text-sm text-n-500">
        Bắt đầu bằng cách thêm sản phẩm mới hoặc nhập dữ liệu hàng loạt từ Excel.
      </p>

      <PermissionGate>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-2xl border border-p-900 bg-p-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-p-700"
          >
            <Plus className="h-4 w-4" />
            Thêm mới sản phẩm
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

export default function ProductList({
  products,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onImportExcel,
  onExportExcel,
}: ProductListProps) {
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

  if (!products.length) {
    return <EmptyState onAdd={onAdd} onImportExcel={onImportExcel} />;
  }

  return (
    <section className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-[32px] border border-p-100 bg-white p-4 shadow-[0_18px_50px_rgba(6,40,32,0.06)] md:p-5">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-n-500">Danh sách sản phẩm</p>
          <h3 className="text-xl font-bold text-n-800">Quản lý sản phẩm bán hàng</h3>
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
          <table className="min-w-[1750px] w-full table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-p-50">
              <tr>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Ảnh sản phẩm</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tên sản phẩm</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Mô tả sản phẩm</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tồn kho</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Đã bán</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Danh mục</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Thương hiệu</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Giá gốc</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Giảm giá (%)</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Giá hiện tại</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Trạng thái</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Tạo lúc</th>
                <th className="border-b border-p-100 px-4 py-3.5 text-left text-sm font-semibold text-n-500">Cập nhật lúc</th>
                <PermissionGate>
                  <th className="border-b border-p-100 px-4 py-3.5 text-center text-sm font-semibold text-n-500">Hành động</th>
                </PermissionGate>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-p-50/70">
                  <td className="border-b border-p-100 px-4 py-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-2xl border border-p-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-p-200 bg-p-50 text-xs font-semibold text-n-500">
                        No img
                      </div>
                    )}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="min-w-[220px]">
                      <p className="break-words font-semibold text-n-800">{product.name}</p>
                      <p className="mt-1 text-xs text-n-500">#{product.id}</p>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <p className="line-clamp-2 max-w-[320px] text-sm text-n-600">
                      {product.description || "--"}
                    </p>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-amber-700">
                      <Boxes className="h-4 w-4" />
                      <span className="font-semibold">{product.quantity}</span>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-2 text-sky-700">
                      <Tag className="h-4 w-4" />
                      <span className="font-semibold">{product.sold}</span>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <span className="inline-flex rounded-full border border-p-200 bg-p-50 px-3 py-1 text-xs font-semibold text-p-700">
                      {product.categoryName}
                    </span>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {product.brandName}
                    </span>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top font-medium text-n-700">
                    {formatCurrency(product.originalPrice)}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-rose-700">
                      <BadgePercent className="h-4 w-4" />
                      <span className="font-semibold">{product.discountPercent}%</span>
                    </div>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top font-semibold text-p-700">
                    {formatCurrency(product.currentPrice)}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "border border-p-200 bg-p-100 text-p-700"
                          : "border border-rose-200 bg-rose-100 text-rose-700"
                      }`}
                    >
                      {product.isActive ? "Đang bán" : "Ngừng bán"}
                    </span>
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top text-sm text-n-600">
                    {formatDateTime(product.created_at)}
                  </td>

                  <td className="border-b border-p-100 px-4 py-4 align-top text-sm text-n-600">
                    {formatDateTime(product.updated_at)}
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
                          onClick={() => onEdit(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                          title="Sửa"
                        >
                          <FileEdit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(product)}
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