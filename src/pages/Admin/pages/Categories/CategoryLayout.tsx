import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import CategoryList from "./CategoryList";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";
import type { CategoryItem } from "./CategoryList";
import CategoryModal from "./CategoryModal";
import type { CategoryFormValues } from "./CategoryModal";

const mockCategories: CategoryItem[] = [
  {
    id: 1,
    name: "Trà truyền thống",
    description:
      "Danh mục dành cho các sản phẩm trà truyền thống, hương vị đậm, phù hợp khách hàng lâu năm.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80",
    isActive: true,
    create_at: "2026-03-10T08:30:00",
    update_at: "2026-03-15T16:10:00",
  },
  {
    id: 2,
    name: "Trà trái cây",
    description:
      "Nhóm sản phẩm trẻ trung, phù hợp khách hàng thích hương vị tươi mới và theo mùa.",
    image:
      "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=300&q=80",
    isActive: false,
    create_at: "2026-03-04T10:00:00",
    update_at: "2026-03-12T09:45:00",
  },
  {
    id: 3,
    name: "Quà tặng cao cấp",
    description:
      "Danh mục các dòng sản phẩm cao cấp, trà hộp quà, dùng cho dịp lễ và doanh nghiệp.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80",
    isActive: true,
    create_at: "2026-02-26T14:05:00",
    update_at: "2026-03-14T18:20:00",
  },
];

function normalizeImportedRow(row: Record<string, unknown>): CategoryFormValues {
  return {
    name: String(row.name ?? row["Tên danh mục"] ?? "").trim(),
    description: String(row.description ?? row["Mô tả"] ?? "").trim(),
    image: String(row.image ?? row["Hình ảnh"] ?? "").trim(),
    isActive: ["true", "1", "hoạt động", "active"].includes(
      String(row.isActive ?? row["Trạng thái"] ?? "")
        .trim()
        .toLowerCase()
    ),
    create_at: row.create_at ? String(row.create_at) : undefined,
    update_at: row.update_at ? String(row.update_at) : undefined,
  };
}

export default function CategoryLayout() {
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const filteredCategories = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return categories;

    return categories.filter((category) =>
      [category.name, category.description].some((value) =>
        String(value || "").toLowerCase().includes(normalized)
      )
    );
  }, [categories, keyword]);

  const activeCount = useMemo(
    () => categories.filter((category) => category.isActive).length,
    [categories]
  );

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

  const handleDelete = (category: CategoryItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}" không?`
    );
    if (!confirmed) return;

    // TODO: gọi API delete tại đây
    setCategories((prev) => prev.filter((item) => item.id !== category.id));
  };

  const handleSubmit = (values: CategoryFormValues) => {
    setLoading(true);

    try {
      if (mode === "create") {
        // TODO: gọi API create tại đây
        const now = new Date().toISOString();

        const newCategory: CategoryItem = {
          id: Date.now(),
          name: values.name,
          description: values.description,
          image: values.image,
          isActive: values.isActive,
          create_at: now,
          update_at: now,
        };

        setCategories((prev) => [newCategory, ...prev]);
      } else if (selectedCategory) {
        // TODO: gọi API update tại đây
        setCategories((prev) =>
          prev.map((item) =>
            item.id === selectedCategory.id
              ? {
                  ...item,
                  name: values.name,
                  description: values.description,
                  image: values.image,
                  isActive: values.isActive,
                  update_at: new Date().toISOString(),
                }
              : item
          )
        );
      }

      setOpenModal(false);
      setSelectedCategory(null);
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
      const rows = await importFromExcel<Record<string, unknown>>(file);

      const normalizedRows = rows
        .map(normalizeImportedRow)
        .filter((item) => item.name);

      const mappedRows: CategoryItem[] = normalizedRows.map((row, index) => ({
        id: Date.now() + index,
        name: row.name,
        description: row.description,
        image: row.image,
        isActive: row.isActive,
        create_at: row.create_at || new Date().toISOString(),
        update_at: row.update_at || new Date().toISOString(),
      }));

      // TODO: nếu muốn import qua API thì gọi API tại đây
      setCategories((prev) => [...mappedRows, ...prev]);
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleExportAllCategories = () => {
    const data = categories.map((category) => ({
      "Tên danh mục": category.name,
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
            <p className="mb-2 text-sm font-medium text-white/80">Trang quản trị danh mục</p>
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