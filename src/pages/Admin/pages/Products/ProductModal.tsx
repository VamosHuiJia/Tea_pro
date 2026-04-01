import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  BadgePercent,
  Boxes,
  ImagePlus,
  PackageCheck,
  Save,
  Wallet,
  X,
} from "lucide-react";
import type { ProductItem } from "./ProductList";

export type ProductOption = {
  id: string | number;
  name: string;
};

export type ProductFormValues = {
  id?: string | number;
  name: string;
  description: string;
  image: string;
  imageFile?: File;
  quantity: number;
  sold: number;
  categoryId: string | number;
  brandId: string | number;
  originalPrice: number;
  discountPercent: number;
  currentPrice: number;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
};

type ProductModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ProductItem | null;
  categories: ProductOption[];
  brands: ProductOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
};

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  image: "",
  quantity: 0,
  sold: 0,
  categoryId: "",
  brandId: "",
  originalPrice: 0,
  discountPercent: 0,
  currentPrice: 0,
  isActive: true,
};

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ProductModal({
  open,
  mode,
  initialData,
  categories,
  brands,
  loading,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormValues>(defaultValues);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || "",
        quantity: Number(initialData.quantity || 0),
        sold: Number(initialData.sold || 0),
        categoryId: initialData.categoryId,
        brandId: initialData.brandId,
        originalPrice: Number(initialData.originalPrice || 0),
        discountPercent: Number(initialData.discountPercent || 0),
        currentPrice: Number(initialData.currentPrice || 0),
        isActive: initialData.isActive,
        created_at: initialData.created_at,
        updated_at: initialData.updated_at,
      });
      return;
    }

    setForm({
      ...defaultValues,
      categoryId: categories[0]?.id ?? "",
      brandId: brands[0]?.id ?? "",
    });
  }, [open, mode, initialData, categories, brands]);

  const title = useMemo(
    () => (mode === "create" ? "Thêm mới sản phẩm" : "Sửa sản phẩm"),
    [mode]
  );

  const selectedCategoryName =
    categories.find((item) => String(item.id) === String(form.categoryId))?.name ||
    "Chưa chọn danh mục";

  const selectedBrandName =
    brands.find((item) => String(item.id) === String(form.brandId))?.name ||
    "Chưa chọn thương hiệu";

  if (!open) return null;

  const recalculateCurrentPrice = (originalPrice: number, discountPercent: number) => {
    const safeOriginal = Number.isFinite(originalPrice) ? originalPrice : 0;
    const safeDiscount = Math.min(100, Math.max(0, discountPercent || 0));
    return Math.max(0, safeOriginal - (safeOriginal * safeDiscount) / 100);
  };

  const updatePriceState = (nextOriginal: number, nextDiscount: number) => {
    setForm((prev) => ({
      ...prev,
      originalPrice: nextOriginal,
      discountPercent: nextDiscount,
      currentPrice: recalculateCurrentPrice(nextOriginal, nextDiscount),
    }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, image: base64, imageFile: file }));
  };

  const handleDropImage = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, image: base64, imageFile: file }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (!String(form.categoryId).trim() || !String(form.brandId).trim()) return;

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity || 0),
      sold: Number(form.sold || 0),
      originalPrice: Number(form.originalPrice || 0),
      discountPercent: Number(form.discountPercent || 0),
      currentPrice: Number(form.currentPrice || 0),
      imageFile: form.imageFile,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-n-800/60 p-4 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-7xl overflow-hidden rounded-[36px] border border-p-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-p-100 px-5 py-4 md:px-7">
          <div>
            <p className="text-sm font-medium text-n-500">Biểu mẫu sản phẩm</p>
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

        <div className="grid max-h-[calc(94vh-81px)] grid-cols-1 overflow-y-auto xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6 p-5 md:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
              <div className="xl:col-span-7">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Nhập tên sản phẩm"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Trạng thái
                </label>
                <select
                  value={String(form.isActive)}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: event.target.value === "true",
                    }))
                  }
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                >
                  <option value="true">Đang bán</option>
                  <option value="false">Ngừng bán</option>
                </select>
              </div>

              <div className="md:col-span-2 xl:col-span-12">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Nhập mô tả sản phẩm"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Danh mục
                </label>
                <select
                  value={String(form.categoryId)}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="xl:col-span-6">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Thương hiệu
                </label>
                <select
                  value={String(form.brandId)}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, brandId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={String(brand.id)}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Tồn kho
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      quantity: Math.max(0, Number(event.target.value || 0)),
                    }))
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Đã bán
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.sold}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      sold: Math.max(0, Number(event.target.value || 0)),
                    }))
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Ảnh sản phẩm
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-p-200 bg-p-50 px-4 py-3 text-sm font-semibold text-p-700 transition hover:bg-p-100"
                >
                  <ImagePlus className="h-4 w-4" />
                  Chọn ảnh
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Giá gốc
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.originalPrice}
                  onChange={(event) =>
                    updatePriceState(
                      Math.max(0, Number(event.target.value || 0)),
                      form.discountPercent
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent}
                  onChange={(event) =>
                    updatePriceState(
                      form.originalPrice,
                      Math.min(100, Math.max(0, Number(event.target.value || 0)))
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="xl:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Giá hiện tại
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.currentPrice}
                  readOnly
                  className="w-full cursor-not-allowed rounded-2xl border border-p-100 bg-p-50 px-4 py-3 text-sm outline-none"
                />
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
            <p className="text-sm font-medium text-n-500">Xem trước sản phẩm</p>

            <div className="mt-4 overflow-hidden rounded-[30px] border border-p-100 bg-white shadow-sm">
              <div className="relative h-64 bg-p-50">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || "Product preview"}
                    className="h-full w-full object-cover"
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
                    className={`flex h-full w-full cursor-pointer items-center justify-center border-2 border-dashed transition ${
                      dragging ? "border-p-500 bg-p-50" : "border-p-200 bg-p-50/60"
                    }`}
                  >
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-10 w-10 text-p-700" />
                      <p className="mt-3 text-sm font-medium text-n-600">
                        Kéo & thả hoặc nhấn để thêm ảnh
                      </p>
                    </div>
                  </label>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/30 bg-white/85 px-3 py-1 text-xs font-semibold text-p-700 backdrop-blur-sm">
                    {selectedCategoryName}
                  </span>
                  <span className="rounded-full border border-white/30 bg-white/85 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
                    {selectedBrandName}
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <h3 className="text-2xl font-bold text-n-800">
                    {form.name || "Tên sản phẩm"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-n-600">
                    {form.description ||
                      "Mô tả sản phẩm sẽ hiển thị tại đây để bạn hình dung trước dữ liệu khi lên giao diện danh sách."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Boxes className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Tồn kho</span>
                    </div>
                    <p className="mt-2 text-xl font-bold text-amber-800">{form.quantity}</p>
                  </div>

                  <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                    <div className="flex items-center gap-2 text-sky-700">
                      <PackageCheck className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">Đã bán</span>
                    </div>
                    <p className="mt-2 text-xl font-bold text-sky-800">{form.sold}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-p-50 p-4">
                    <div className="flex items-center gap-2 text-n-600">
                      <Wallet className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Giá gốc</span>
                    </div>
                    <p className="mt-2 font-bold text-n-800">{formatCurrency(form.originalPrice)}</p>
                  </div>

                  <div className="rounded-2xl bg-rose-50 p-4">
                    <div className="flex items-center gap-2 text-rose-700">
                      <BadgePercent className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Giảm giá</span>
                    </div>
                    <p className="mt-2 font-bold text-rose-800">{form.discountPercent}%</p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Wallet className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Giá bán</span>
                    </div>
                    <p className="mt-2 font-bold text-emerald-800">{formatCurrency(form.currentPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
