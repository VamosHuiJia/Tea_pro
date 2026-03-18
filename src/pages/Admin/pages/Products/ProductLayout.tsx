import { useMemo, useRef, useState } from "react";
import {
  BadgePercent,
  Box,
  Search,
  ShoppingBag,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ProductList from "./ProductList";
import type { ProductItem } from "./ProductList";
import ProductModal from "./ProductModal";
import type { ProductFormValues, ProductOption } from "./ProductModal";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";

const mockCategories: ProductOption[] = [
  { id: 1, name: "Trà truyền thống" },
  { id: 2, name: "Trà trái cây" },
  { id: 3, name: "Quà tặng cao cấp" },
  { id: 4, name: "Phụ kiện pha trà" },
];

const mockBrands: ProductOption[] = [
  { id: 1, name: "Lộc Phát Tea" },
  { id: 2, name: "Moon Leaf" },
  { id: 3, name: "Zen Brew" },
  { id: 4, name: "Mộc Nhiên" },
];

const mockProducts: ProductItem[] = [
  {
    id: 101,
    name: "Trà Oolong Thượng Hạng",
    description:
      "Dòng trà cao cấp hương dịu, hậu ngọt, phù hợp khách hàng yêu thích vị trà thanh và tinh tế.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80",
    quantity: 120,
    sold: 315,
    categoryId: 1,
    categoryName: "Trà truyền thống",
    brandId: 1,
    brandName: "Lộc Phát Tea",
    originalPrice: 250000,
    discountPercent: 12,
    currentPrice: 220000,
    isActive: true,
    created_at: "2026-03-08T08:30:00",
    updated_at: "2026-03-17T15:20:00",
  },
  {
    id: 102,
    name: "Trà Vải Hoa Hồng",
    description:
      "Sản phẩm trẻ trung, hương vải thơm mát kết hợp hậu vị hoa hồng nhẹ, bán tốt trong mùa hè.",
    image:
      "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=500&q=80",
    quantity: 86,
    sold: 248,
    categoryId: 2,
    categoryName: "Trà trái cây",
    brandId: 2,
    brandName: "Moon Leaf",
    originalPrice: 89000,
    discountPercent: 10,
    currentPrice: 80100,
    isActive: true,
    created_at: "2026-03-05T10:00:00",
    updated_at: "2026-03-18T09:10:00",
  },
  {
    id: 103,
    name: "Hộp Quà Trà Xuân Premium",
    description:
      "Set quà tặng trà đóng hộp sang trọng, phù hợp khách doanh nghiệp và dịp lễ đặc biệt.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    quantity: 40,
    sold: 95,
    categoryId: 3,
    categoryName: "Quà tặng cao cấp",
    brandId: 3,
    brandName: "Zen Brew",
    originalPrice: 520000,
    discountPercent: 18,
    currentPrice: 426400,
    isActive: false,
    created_at: "2026-02-26T14:05:00",
    updated_at: "2026-03-16T17:45:00",
  },
  {
    id: 104,
    name: "Bình Pha Trà Thủy Tinh",
    description:
      "Phụ kiện pha trà tối giản, phù hợp cho set quà và bán kèm cùng sản phẩm trà đóng gói.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
    quantity: 64,
    sold: 112,
    categoryId: 4,
    categoryName: "Phụ kiện pha trà",
    brandId: 4,
    brandName: "Mộc Nhiên",
    originalPrice: 180000,
    discountPercent: 5,
    currentPrice: 171000,
    isActive: true,
    created_at: "2026-03-01T12:20:00",
    updated_at: "2026-03-15T11:40:00",
  },
];

function normalizeImportedRow(row: Record<string, unknown>) {
  const categoryName = String(
    row.categoryName ?? row.category ?? row["Danh mục"] ?? ""
  ).trim();
  const brandName = String(
    row.brandName ?? row.brand ?? row["Thương hiệu"] ?? ""
  ).trim();

  const category = mockCategories.find(
    (item) => item.name.toLowerCase() === categoryName.toLowerCase()
  );
  const brand = mockBrands.find(
    (item) => item.name.toLowerCase() === brandName.toLowerCase()
  );

  const originalPrice = Number(row.originalPrice ?? row["Giá gốc"] ?? 0) || 0;
  const discountPercent =
    Number(row.discountPercent ?? row["Giảm giá (%)"] ?? 0) || 0;
  const currentPrice =
    Number(row.currentPrice ?? row["Giá hiện tại"] ?? 0) ||
    Math.max(0, originalPrice - (originalPrice * discountPercent) / 100);

  return {
    name: String(row.name ?? row["Tên sản phẩm"] ?? "").trim(),
    description: String(row.description ?? row["Mô tả sản phẩm"] ?? "").trim(),
    image: String(row.image ?? row.urlImg ?? row["Ảnh sản phẩm"] ?? "").trim(),
    quantity: Math.max(0, Number(row.quantity ?? row["Tồn kho"] ?? 0) || 0),
    sold: Math.max(0, Number(row.sold ?? row["Đã bán"] ?? 0) || 0),
    categoryId: category?.id ?? "",
    categoryName: category?.name ?? "",
    brandId: brand?.id ?? "",
    brandName: brand?.name ?? "",
    originalPrice,
    discountPercent,
    currentPrice,
    isActive: ["true", "1", "đang bán", "active", "hoạt động"].includes(
      String(row.isActive ?? row["Trạng thái"] ?? "")
        .trim()
        .toLowerCase()
    ),
    created_at: row.created_at
      ? String(row.created_at)
      : row["Tạo lúc"]
        ? String(row["Tạo lúc"])
        : undefined,
    updated_at: row.updated_at
      ? String(row.updated_at)
      : row["Cập nhật lúc"]
        ? String(row["Cập nhật lúc"])
        : undefined,
  };
}

export default function ProductLayout() {
  const [products, setProducts] = useState<ProductItem[]>(mockProducts);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProducts = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const matchesKeyword =
        !normalized ||
        [
          product.name,
          product.description,
          product.categoryName,
          product.brandName,
        ].some((value) => String(value || "").toLowerCase().includes(normalized));

      const matchesCategory =
        selectedCategory === "all" ||
        String(product.categoryId) === String(selectedCategory);

      const matchesBrand =
        selectedBrand === "all" || String(product.brandId) === String(selectedBrand);

      return matchesKeyword && matchesCategory && matchesBrand;
    });
  }, [products, keyword, selectedCategory, selectedBrand]);

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalSold = products.reduce((sum, item) => sum + Number(item.sold || 0), 0);
    const activeProducts = products.filter((item) => item.isActive).length;
    const averageDiscount =
      products.length > 0
        ? Math.round(
          products.reduce((sum, item) => sum + Number(item.discountPercent || 0), 0) /
          products.length
        )
        : 0;

    return { totalStock, totalSold, activeProducts, averageDiscount };
  }, [products]);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedProduct(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setMode("edit");
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDelete = (product: ProductItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`
    );
    if (!confirmed) return;

    // TODO: gọi API delete tại đây
    setProducts((prev) => prev.filter((item) => item.id !== product.id));
  };

  const handleSubmit = (values: ProductFormValues) => {
    setLoading(true);

    try {
      const category = mockCategories.find(
        (item) => String(item.id) === String(values.categoryId)
      );
      const brand = mockBrands.find((item) => String(item.id) === String(values.brandId));

      if (!category || !brand) return;

      if (mode === "create") {
        const now = new Date().toISOString();

        const newProduct: ProductItem = {
          id: Date.now(),
          name: values.name,
          description: values.description,
          image: values.image,
          quantity: Number(values.quantity || 0),
          sold: Number(values.sold || 0),
          categoryId: category.id,
          categoryName: category.name,
          brandId: brand.id,
          brandName: brand.name,
          originalPrice: Number(values.originalPrice || 0),
          discountPercent: Number(values.discountPercent || 0),
          currentPrice: Number(values.currentPrice || 0),
          isActive: values.isActive,
          created_at: now,
          updated_at: now,
        };

        // TODO: gọi API create tại đây
        setProducts((prev) => [newProduct, ...prev]);
      } else if (selectedProduct) {
        // TODO: gọi API update tại đây
        setProducts((prev) =>
          prev.map((item) =>
            item.id === selectedProduct.id
              ? {
                ...item,
                name: values.name,
                description: values.description,
                image: values.image,
                quantity: Number(values.quantity || 0),
                sold: Number(values.sold || 0),
                categoryId: category.id,
                categoryName: category.name,
                brandId: brand.id,
                brandName: brand.name,
                originalPrice: Number(values.originalPrice || 0),
                discountPercent: Number(values.discountPercent || 0),
                currentPrice: Number(values.currentPrice || 0),
                isActive: values.isActive,
                updated_at: new Date().toISOString(),
              }
              : item
          )
        );
      }

      setOpenModal(false);
      setSelectedProduct(null);
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
        .filter((item) => item.name && item.categoryId && item.brandId);

      const mappedRows: ProductItem[] = normalizedRows.map((row, index) => ({
        id: Date.now() + index,
        name: row.name,
        description: row.description,
        image: row.image,
        quantity: row.quantity,
        sold: row.sold,
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        brandId: row.brandId,
        brandName: row.brandName,
        originalPrice: row.originalPrice,
        discountPercent: row.discountPercent,
        currentPrice: row.currentPrice,
        isActive: row.isActive,
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
      }));

      // TODO: nếu muốn import qua API thì gọi API tại đây
      setProducts((prev) => [...mappedRows, ...prev]);
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleExportAllProducts = () => {
    const data = products.map((product) => ({
      "Tên sản phẩm": product.name,
      "Mô tả sản phẩm": product.description || "",
      "Ảnh sản phẩm": product.image || "",
      "Tồn kho": product.quantity,
      "Đã bán": product.sold,
      "Danh mục": product.categoryName,
      "Thương hiệu": product.brandName,
      "Giá gốc": product.originalPrice,
      "Giảm giá (%)": product.discountPercent,
      "Giá hiện tại": product.currentPrice,
      "Trạng thái": product.isActive ? "Đang bán" : "Ngừng bán",
      "Tạo lúc": product.created_at || "",
      "Cập nhật lúc": product.updated_at || "",
    }));

    exportToExcel(data, "danh-sach-san-pham.xlsx", "Products");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%),linear-gradient(135deg,#062820_0%,#0F6D51_45%,#22B684_100%)] p-6 text-white shadow-[0_20px_60px_rgba(6,40,32,0.25)] md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-emerald-200/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Trang quản trị sản phẩm
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">Quản lý sản phẩm</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng sản phẩm</p>
              <p className="mt-2 text-2xl font-bold">{products.length}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Đang bán</p>
              <p className="mt-2 text-2xl font-bold">{stats.activeProducts}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Tồn kho</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalStock}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Giảm giá TB</p>
              <p className="mt-2 text-2xl font-bold">{stats.averageDiscount}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[30px] border border-p-100 bg-white p-5 shadow-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tên sản phẩm, mô tả, danh mục hoặc thương hiệu..."
              className="w-full rounded-2xl border border-p-100 bg-p-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-p-100 bg-white/90 p-4 shadow-[0_10px_30px_rgba(34,182,132,0.08)]">
            <div className="group relative">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/60 px-4 py-3.5 pr-12 text-sm font-semibold text-n-700 outline-none transition-all duration-200 hover:border-p-300 focus:border-p-400 focus:bg-white focus:ring-4 focus:ring-p-100"
              >
                <option value="all">Tất cả danh mục</option>
                {mockCategories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-p-700" />
            </div>
          </div>

          <div className="rounded-3xl border border-p-100 bg-white/90 p-4 shadow-[0_10px_30px_rgba(34,182,132,0.08)]">
            <div className="group relative">
              <select
                value={selectedBrand}
                onChange={(event) => setSelectedBrand(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/60 px-4 py-3.5 pr-12 text-sm font-semibold text-n-700 outline-none transition-all duration-200 hover:border-p-300 focus:border-p-400 focus:bg-white focus:ring-4 focus:ring-p-100"
              >
                <option value="all">Tất cả thương hiệu</option>
                {mockBrands.map((brand) => (
                  <option key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-p-700" />
            </div>
          </div>
        </div>
      </section>

      <ProductList
        products={filteredProducts}
        loading={false}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onImportExcel={handleImportExcelClick}
        onExportExcel={handleExportAllProducts}
      />

      <input
        ref={excelInputRef}
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcelFile}
      />

      <ProductModal
        open={openModal}
        mode={mode}
        initialData={selectedProduct}
        categories={mockCategories}
        brands={mockBrands}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
