import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { ImagePlus, Save, X } from "lucide-react";
import type { BrandItem } from "./BrandList";

export type BrandFormValues = {
  id?: string | number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  create_at?: string;
  update_at?: string;
};

type BrandModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: BrandItem | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: BrandFormValues) => void;
};

const defaultValues: BrandFormValues = {
  name: "",
  description: "",
  image: "",
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

export default function BrandModal({
  open,
  mode,
  initialData,
  loading,
  onClose,
  onSubmit,
}: BrandModalProps) {
  const [form, setForm] = useState<BrandFormValues>(defaultValues);
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
        isActive: initialData.isActive,
        create_at: initialData.create_at,
        update_at: initialData.update_at,
      });
      return;
    }

    setForm(defaultValues);
  }, [open, mode, initialData]);

  const title = useMemo(
    () => (mode === "create" ? "Thêm mới thương hiệu" : "Sửa thương hiệu"),
    [mode]
  );

  if (!open) return null;

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, image: base64 }));
  };

  const handleDropImage = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, image: base64 }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-n-800/55 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-p-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-p-100 px-5 py-4 md:px-7">
          <div>
            <p className="text-sm font-medium text-n-500">Biểu mẫu thương hiệu</p>
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

        <div className="grid max-h-[calc(92vh-81px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 p-5 md:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Tên thương hiệu
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Nhập tên thương hiệu"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Mô tả
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
                  placeholder="Nhập mô tả thương hiệu"
                  className="w-full rounded-2xl border border-p-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-p-400"
                />
              </div>

              <div>
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
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-n-700">
                  Ảnh thương hiệu
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

          <div className="border-t border-p-100 bg-p-50/50 p-5 lg:border-l lg:border-t-0 md:p-7">
            <p className="text-sm font-medium text-n-500">Xem trước</p>

            <div className="mt-4 rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || "Brand preview"}
                    className="h-24 w-24 rounded-3xl border border-p-100 object-cover"
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
                    className={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed transition ${
                      dragging
                        ? "border-p-500 bg-p-50"
                        : "border-p-200 bg-white"
                    }`}
                  >
                    <ImagePlus className="h-8 w-8 text-p-700" />
                  </label>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-bold text-n-800">
                    {form.name || "Tên thương hiệu"}
                  </h3>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      form.isActive
                        ? "border border-p-200 bg-p-100 text-p-700"
                        : "border border-rose-200 bg-rose-100 text-rose-700"
                    }`}
                  >
                    {form.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-p-50 p-4">
                <p className="text-sm font-semibold text-n-700">Mô tả</p>
                <p className="mt-2 text-sm leading-7 text-n-600">
                  {form.description || "Mô tả thương hiệu sẽ hiển thị tại đây."}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-p-200 bg-white p-4 text-sm text-n-500">
                Kéo & thả ảnh vào ô bên trái hoặc nhấn nút{" "}
                <span className="font-semibold text-p-700">Chọn ảnh</span> để tải ảnh lên.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}