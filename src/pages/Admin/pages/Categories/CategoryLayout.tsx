import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import CategoryList from "./CategoryList";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";
import type { CategoryItem } from "./CategoryList";
import CategoryModal from "./CategoryModal";
import type { CategoryFormValues } from "./CategoryModal";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../../../api/admin/category.api";
import { useToast } from "../../../../contexts/ToastContext";
import { useConfirm } from "../../../../contexts/ConfirmContext";

function normalizeImportedRow(row: Record<string, unknown>): CategoryFormValues {
  return {
    name: String(row.name ?? row["Tên danh mục"] ?? "").trim(),
    title: String(row.title ?? row["Tiêu đề"] ?? "").trim(),
    description: String(row.description ?? row["Mô tả"] ?? "").trim(),
    image: String(row.image ?? row["Hình ảnh"] ?? "").trim(),
    isActive: ["true", "1", "hoạt động", "active", "true", "yes"].includes(
      String(row.isActive ?? row["Trạng thái"] ?? "active")
        .trim()
        .toLowerCase()
    ),
  };
}

export default function CategoryLayout() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const filteredCategories = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return categories;

    return categories.filter((category) =>
      [category.name, category.title, category.description].some((value) =>
        String(value || "").toLowerCase().includes(normalized)
      )
    );
  }, [categories, keyword]);

  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories]
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error(error);
      showToast("Lỗi tải danh sách danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedCategory(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setMode("edit");
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleDelete = async (category: CategoryItem) => {
    const confirmed = await confirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}" không?`
    );
    if (!confirmed) return;

    try {
      await deleteCategory(Number(category.id));
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      showToast("Xóa thành công!", "success");
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi xóa danh mục", "error");
    }
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("isActive", String(values.isActive));
      
      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      if (mode === "create") {
        const res = await createCategory(formData);
        if (res.success) {
          setCategories((prev) => [res.data, ...prev]);
          showToast("Thêm mới thành công!", "success");
        }
      } else if (selectedCategory) {
        const res = await updateCategory(Number(selectedCategory.id), formData);
        if (res.success) {
          setCategories((prev) =>
            prev.map((item) => (item.id === selectedCategory.id ? res.data : item))
          );
          showToast("Cập nhật thành công!", "success");
        }
      }

      setOpenModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Lỗi submit category:", error);
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
          const existingCategory = categories.find(c => c.name.toLowerCase() === row.name.toLowerCase());
          let isUpdate = false;
          let categoryIdToUpdate: number | null = null;
  
          if (existingCategory) {
            const userConfirmed = await confirm(`Danh mục "${row.name}" đã tồn tại. Bạn có muốn cập nhật thông tin không?`);
            if (!userConfirmed) continue;
            
            isUpdate = true;
            categoryIdToUpdate = Number(existingCategory.id);
          }

          const formData = new FormData();
          formData.append("name", row.name);
          formData.append("title", row.title);
          formData.append("description", row.description);
          formData.append("isActive", String(row.isActive));

          if (isUpdate && categoryIdToUpdate) {
            await updateCategory(categoryIdToUpdate, formData);
          } else {
            await createCategory(formData);
          }
          successCount++;
        } catch (err) {
          console.error(`Lỗi nhập mục ${row.name}:`, err);
        }
      }

      showToast(`Đã nhập thành công ${successCount}/${normalizedRows.length} danh mục`, "success");
      await fetchCategories();
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleExportAllCategories = () => {
    const data = categories.map((category) => ({
      "Tên danh mục": category.name,
      "Tiêu đề": category.title || "",
      "Mô tả": category.description || "",
      "Hình ảnh": category.image || "",
      "Trạng thái": category.isActive ? "Hoạt động" : "Không hoạt động",
      "Tạo lúc": category.create_at || "",
      "Cập nhật lúc": category.update_at || "",
    }));

    exportToExcel(data, "danh-sach-danh-muc.xlsx", "Categories");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý Danh mục</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng danh mục</p>
              <p className="mt-1 text-lg font-semibold">{categories.length}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Đang hoạt động</p>
              <p className="mt-1 text-lg font-semibold">{activeCount}</p>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm sm:col-span-1">
              <p className="text-xs text-white/70">Không hoạt động</p>
              <p className="mt-1 text-lg font-semibold">{categories.length - activeCount}</p>
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
            placeholder="Nhập tên hoặc mô tả danh mục..."
            className="w-full rounded-2xl border border-p-100 bg-p-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
          />
        </div>
      </section>

      <CategoryList
        categories={filteredCategories}
        loading={false}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onImportExcel={handleImportExcelClick}
        onExportExcel={handleExportAllCategories}
      />

      <input
        ref={excelInputRef}
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcelFile}
      />

      <CategoryModal
        open={openModal}
        mode={mode}
        initialData={selectedCategory}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}