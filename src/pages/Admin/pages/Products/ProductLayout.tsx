import { useEffect, useMemo, useRef, useState } from "react";
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
import { getAllCategories } from "../../../../api/admin/category.api";
import { getAllBrands } from "../../../../api/admin/brand.api";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../../../api/admin/product.api";
import { useToast } from "../../../../contexts/ToastContext";

function normalizeImportedRow(row: Record<string, unknown>, categories: ProductOption[], brands: ProductOption[]) {
  const categoryName = String(
    row.categoryName ?? row.category ?? row["Danh mục"] ?? ""
  ).trim();
  const brandName = String(
    row.brandName ?? row.brand ?? row["Thương hiệu"] ?? ""
  ).trim();

  const category = categories.find(
    (item) => item.name.toLowerCase() === categoryName.toLowerCase()
  );
  const brand = brands.find(
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
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ProductOption[]>([]);
  const [brands, setBrands] = useState<ProductOption[]>([]);
  
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const { showToast } = useToast();

  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const fetchData = async () => {
    setListLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllBrands()
      ]);
      setCategories(catRes.data?.map((c: any) => ({ id: c.id, name: c.name })) || []);
      setBrands(brandRes.data?.map((b: any) => ({ id: b.id, name: b.name })) || []);
      
      setProducts(prodRes.map((p: any) => ({
         ...p,
         image: p.urlImg || null,
         categoryName: p.category?.name || "Không rõ",
         brandName: p.brand?.name || "Không rõ"
      })));
    } catch (error) {
       console.error("Lỗi lấy dữ liệu:", error);
    } finally {
       setListLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (product: ProductItem) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`
    );
    if (!confirmed) return;

    try {
      await deleteProduct(Number(product.id));
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      showToast("Xóa thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xóa sản phẩm", "error");
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("quantity", String(values.quantity || 0));
      formData.append("categoryId", String(values.categoryId));
      formData.append("brandId", String(values.brandId));
      formData.append("originalPrice", String(values.originalPrice || 0));
      formData.append("discountPercent", String(values.discountPercent || 0));
      formData.append("isActive", String(values.isActive));
      
      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      if (mode === "create") {
        const res = await createProduct(formData);
        if (res.product) {
          const cName = categories.find(c => String(c.id) === String(res.product.categoryId))?.name || "";
          const bName = brands.find(b => String(b.id) === String(res.product.brandId))?.name || "";
          const newProduct: ProductItem = {
             ...res.product,
             image: res.product.urlImg,
             categoryName: cName,
             brandName: bName
          };
          setProducts((prev) => [newProduct, ...prev]);
          showToast("Thêm thành công!", "success");
        }
      } else if (selectedProduct) {
        const res = await updateProduct(Number(selectedProduct.id), formData);
        if (res.product) {
          const cName = categories.find(c => String(c.id) === String(res.product.categoryId))?.name || "";
          const bName = brands.find(b => String(b.id) === String(res.product.brandId))?.name || "";
          const newProduct: ProductItem = {
             ...res.product,
             image: res.product.urlImg,
             categoryName: cName,
             brandName: bName
          };
          setProducts((prev) =>
            prev.map((item) => (item.id === selectedProduct.id ? newProduct : item))
          );
          showToast("Cập nhật thành công!", "success");
        }
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
        .map(row => normalizeImportedRow(row, categories, brands))
        .filter((item) => item.name && item.categoryId && item.brandId);

      // Nhập qua API thay vì list tĩnh
      for (const row of normalizedRows) {
        const formData = new FormData();
        formData.append("name", row.name);
        formData.append("description", row.description || "");
        formData.append("quantity", String(row.quantity || 0));
        formData.append("categoryId", String(row.categoryId));
        formData.append("brandId", String(row.brandId));
        formData.append("originalPrice", String(row.originalPrice || 0));
        formData.append("discountPercent", String(row.discountPercent || 0));
        formData.append("isActive", String(row.isActive));
        
        try {
          await createProduct(formData);
        } catch (e) {
          console.error("Lỗi dòng:", row.name, e);
        }
      }
      
      showToast("Đã hoàn tất nhập dữ liệu Excel!", "success");
      await fetchData();
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
                {categories.map((category: ProductOption) => (
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
                {brands.map((brand: ProductOption) => (
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
        loading={listLoading}
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
        categories={categories}
        brands={brands}
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
