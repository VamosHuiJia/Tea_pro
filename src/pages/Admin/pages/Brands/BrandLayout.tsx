import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import BrandList from "./BrandList";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";
import type { BrandItem } from "./BrandList";
import BrandModal from "./BrandModal";
import type { BrandFormValues } from "./BrandModal";
import { getAllBrands, createBrand, updateBrand, deleteBrand } from "../../../../api/admin/brand.api";
import { useToast } from "../../../../contexts/ToastContext";

function normalizeImportedRow(row: Record<string, unknown>): BrandFormValues {
  return {
    name: String(row.name ?? row["Tên thương hiệu"] ?? "").trim(),
    description: String(row.description ?? row["Mô tả"] ?? "").trim(),
    image: String(row.image ?? row["Hình ảnh"] ?? "").trim(),
    isActive: ["true", "1", "hoạt động", "active", "true", "yes"].includes(
      String(row.isActive ?? row["Trạng thái"] ?? "active")
        .trim()
        .toLowerCase()
    ),
  };
}

export default function BrandLayout() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const { showToast } = useToast();

  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const filteredBrands = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return brands;

    return brands.filter((brand) =>
      [brand.name, brand.description].some((value) =>
        String(value || "").toLowerCase().includes(normalized)
      )
    );
  }, [brands, keyword]);

  const activeCount = useMemo(() => brands.filter((brand) => brand.isActive).length, [brands]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await getAllBrands();
      if (res.success) {
        setBrands(res.data);
      }
    } catch (error) {
      console.error(error);
      showToast("Lỗi tải danh sách thương hiệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedBrand(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (brand: BrandItem) => {
    setMode("edit");
    setSelectedBrand(brand);
    setOpenModal(true);
  };

  const handleDelete = async (brand: BrandItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thương hiệu "${brand.name}" không?`
    );
    if (!confirmed) return;

    try {
      await deleteBrand(Number(brand.id));
      setBrands((prev) => prev.filter((item) => item.id !== brand.id));
      showToast("Xóa thành công!", "success");
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi xóa thương hiệu", "error");
    }
  };

  const handleSubmit = async (values: BrandFormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("isActive", String(values.isActive));
      
      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      if (mode === "create") {
        const res = await createBrand(formData);
        if (res.success) {
          setBrands((prev) => [res.data, ...prev]);
          showToast("Thêm mới thành công!", "success");
        }
      } else if (selectedBrand) {
        const res = await updateBrand(Number(selectedBrand.id), formData);
        if (res.success) {
          setBrands((prev) =>
            prev.map((item) => (item.id === selectedBrand.id ? res.data : item))
          );
          showToast("Cập nhật thành công!", "success");
        }
      }

      setOpenModal(false);
      setSelectedBrand(null);
    } catch (error) {
      console.error("Lỗi submit brand:", error);
      showToast("Đã xảy ra lỗi khi lưu thông tin", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImportExcelClick = () => {
    excelInputRef.current?.click();
  };

  const handleImportExcelFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const rows = await importFromExcel<Record<string, unknown>>(file);

      const normalizedRows = rows
        .map(normalizeImportedRow)
        .filter((item) => item.name);

      let successCount = 0;
      for (const row of normalizedRows) {
        try {
          const formData = new FormData();
          formData.append("name", row.name);
          formData.append("description", row.description);
          formData.append("isActive", String(row.isActive));
          // Import excel không hỗ trợ trực tiếp ảnh dưới dạng file

          await createBrand(formData);
          successCount++;
        } catch (err) {
          console.error(`Lỗi nhập mục ${row.name}:`, err);
        }
      }

      showToast(`Đã nhập thành công ${successCount}/${normalizedRows.length} thương hiệu`, "success");
      await fetchBrands();
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      showToast("Lỗi khi đọc file Excel", "error");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleExportAllBrands = () => {
    const data = brands.map((brand) => ({
      "Tên thương hiệu": brand.name,
      "Mô tả": brand.description || "",
      "Hình ảnh": brand.image || "",
      "Trạng thái": brand.isActive ? "Hoạt động" : "Không hoạt động",
      "Tạo lúc": brand.create_at || "",
      "Cập nhật lúc": brand.update_at || "",
    }));

    exportToExcel(data, "danh-sach-thuong-hieu.xlsx", "Brands");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">Trang quản trị thương hiệu</p>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý Thương hiệu</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm text-center">
              <p className="text-xs text-white/70">Tổng thương hiệu</p>
              <p className="mt-1 text-lg font-semibold ">{brands.length}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm text-center">
              <p className="text-xs text-white/70">Đang hoạt động</p>
              <p className="mt-1 text-lg font-semibold">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm col-span-2 sm:col-span-1 text-center">
              <p className="text-xs text-white/70">Không hoạt động</p>
              <p className="mt-1 text-lg font-semibold">{brands.length - activeCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Nhập tên hoặc mô tả thương hiệu..."
            className="w-full rounded-2xl border border-p-100 bg-p-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
          />
        </div>
      </section>

      <BrandList
        brands={filteredBrands}
        loading={false}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onImportExcel={handleImportExcelClick}
        onExportExcel={handleExportAllBrands}
      />

      <input
        ref={excelInputRef}
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcelFile}
      />

      <BrandModal
        open={openModal}
        mode={mode}
        initialData={selectedBrand}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
          setSelectedBrand(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}