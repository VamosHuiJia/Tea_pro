import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Search } from "lucide-react";
import BrandList from "./BrandList";
import type { BrandItem } from "./BrandList";
import BrandModal from "./BrandModal";
import type { BrandFormValues } from "./BrandModal";

const mockBrands: BrandItem[] = [
  {
    id: 1,
    name: "Lộc Phát Tea",
    description:
      "Thương hiệu trà hướng tới hương vị truyền thống, phù hợp nhóm khách hàng yêu thích trà đậm vị.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80",
    isActive: true,
    create_at: "2026-03-10T08:30:00",
    update_at: "2026-03-15T16:10:00",
  },
  {
    id: 2,
    name: "Moon Leaf",
    description:
      "Bộ nhận diện trẻ trung, thiên về các dòng trà trái cây và sản phẩm theo mùa.",
    image:
      "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=300&q=80",
    isActive: false,
    create_at: "2026-03-04T10:00:00",
    update_at: "2026-03-12T09:45:00",
  },
  {
    id: 3,
    name: "Zen Brew",
    description:
      "Phong cách tối giản, cao cấp, tập trung vào trà nguyên lá và quà tặng doanh nghiệp.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80",
    isActive: true,
    create_at: "2026-02-26T14:05:00",
    update_at: "2026-03-14T18:20:00",
  },
];

function normalizeImportedRow(row: Record<string, unknown>): BrandFormValues {
  return {
    name: String(row.name ?? row["Tên thương hiệu"] ?? "").trim(),
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

export default function BrandLayout() {
  const [brands, setBrands] = useState<BrandItem[]>(mockBrands);
  const [keyword, setKeyword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

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

  const handleDelete = (brand: BrandItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thương hiệu "${brand.name}" không?`
    );
    if (!confirmed) return;

    // TODO: gọi API delete tại đây
    setBrands((prev) => prev.filter((item) => item.id !== brand.id));
  };

  const handleSubmit = (values: BrandFormValues) => {
    setLoading(true);

    try {
      if (mode === "create") {
        // TODO: gọi API create tại đây
        const now = new Date().toISOString();

        const newBrand: BrandItem = {
          id: Date.now(),
          name: values.name,
          description: values.description,
          image: values.image,
          isActive: values.isActive,
          create_at: now,
          update_at: now,
        };

        setBrands((prev) => [newBrand, ...prev]);
      } else if (selectedBrand) {
        // TODO: gọi API update tại đây
        setBrands((prev) =>
          prev.map((item) =>
            item.id === selectedBrand.id
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
      setSelectedBrand(null);
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

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      defval: "",
    });

    const normalizedRows = rows
      .map(normalizeImportedRow)
      .filter((item) => item.name);

    const mappedRows: BrandItem[] = normalizedRows.map((row, index) => ({
      id: Date.now() + index,
      name: row.name,
      description: row.description,
      image: row.image,
      isActive: row.isActive,
      create_at: row.create_at || new Date().toISOString(),
      update_at: row.update_at || new Date().toISOString(),
    }));

    // TODO: nếu muốn import qua API thì gọi API tại đây
    setBrands((prev) => [...mappedRows, ...prev]);
    event.target.value = "";
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

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");
    XLSX.writeFile(workbook, "danh-sach-thuong-hieu.xlsx");
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
            <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
              Theo dõi, thêm mới, chỉnh sửa và xuất nhập danh sách thương hiệu một cách trực quan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng thương hiệu</p>
              <p className="mt-1 text-lg font-semibold">{brands.length}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs text-white/70">Đang hoạt động</p>
              <p className="mt-1 text-lg font-semibold">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm col-span-2 sm:col-span-1">
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