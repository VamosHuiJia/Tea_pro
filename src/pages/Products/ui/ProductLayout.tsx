import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  SlidersHorizontal,
  Tags,
  Wallet,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { productList } from "../../../animations/data";

const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "under-100k", label: "Dưới 100.000đ", min: 0, max: 100_000 },
  { id: "100k-200k", label: "100.000đ - 200.000đ", min: 100_000, max: 200_000 },
  { id: "200k-350k", label: "200.000đ - 350.000đ", min: 200_000, max: 350_000 },
  { id: "above-350k", label: "Trên 350.000đ", min: 350_000, max: Number.POSITIVE_INFINITY },
] as const;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("filter-category") || "all";
  const activeBrand = searchParams.get("filter-brand") || "all";
  const activePrice = searchParams.get("filter-price") || "all";

  const categories = useMemo(() => {
    const mapped = productList.map((item) => item.category);
    const unique = mapped.filter(
      (category, index, arr) =>
        arr.findIndex((c) => c.slug === category.slug) === index
    );

    return [{ id: 0, name: "Tất cả", slug: "all" }, ...unique];
  }, []);

  const brands = useMemo(() => {
    const mapped = productList
      .map((item, index) => {
        const name = item.brand?.name || `Nhãn hàng ${index + 1}`;
        const slug = item.brand?.slug || toSlug(name);

        return {
          id: item.brand?.id ?? index + 1,
          name,
          slug,
        };
      })
      .filter((brand, index, arr) =>
        arr.findIndex((b) => b.slug === brand.slug) === index
      );

    return [{ id: 0, name: "Tất cả nhãn hàng", slug: "all" }, ...mapped];
  }, []);

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const productCategorySlug = product.category?.slug || "";
      const productBrandSlug = product.brand?.slug
        ? product.brand.slug
        : toSlug(product.brand?.name || "");
      const productPrice = Number(product.currentPrice || product.originalPrice || 0);

      if (activeCategory !== "all" && productCategorySlug !== activeCategory) {
        return false;
      }

      if (activeBrand !== "all" && productBrandSlug !== activeBrand) {
        return false;
      }

      if (activePrice !== "all") {
        const selectedRange = PRICE_RANGES.find((range) => range.id === activePrice);

        if (selectedRange) {
          if (
            productPrice < selectedRange.min ||
            productPrice > selectedRange.max
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [activeBrand, activeCategory, activePrice]);

  const updateFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === "all") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  const hasAnyFilter =
    activeCategory !== "all" || activeBrand !== "all" || activePrice !== "all";

  return (
    <section id="products">
      <main className="container mt-10">
        <img
          data-aos="flip-up"
          src="../../../../public/images/banners/banner2.jpg"
          alt="products banner"
          className="h-[350px] w-full object-cover shadow-xl"
        />

        <div className="mt-8 rounded-[32px] border border-p-100 bg-white/90 p-3 shadow-[0_16px_40px_rgba(6,40,32,0.06)] backdrop-blur-sm md:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
            <div className="min-w-0 flex-1 rounded-[28px] border border-p-100 bg-n-50/40 p-3">
              <div className="mb-3 flex items-center gap-3 px-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-p-50 text-p-900">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  
                  <h3 className="truncate text-sm font-bold text-n-800 md:text-base">
                    Chọn danh mục sản phẩm
                  </h3>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 rounded-r-full border-l border-white/70 bg-gradient-to-l from-white via-white/90 to-transparent" />

                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max gap-3 pr-16">
                    {categories.map((category) => {
                      const isActive = activeCategory === category.slug;

                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() =>
                            updateFilter("filter-category", category.slug)
                          }
                          className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition ${
                            isActive
                              ? "border-p-900 bg-p-900 text-white shadow-[0_10px_24px_rgba(15,109,81,0.18)]"
                              : "border border-p-100 bg-white text-n-700 hover:bg-p-50"
                          }`}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[430px] xl:flex-none">
              <div className="rounded-[28px] border border-p-100 bg-white p-4 shadow-sm transition hover:border-p-200">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-p-50 text-p-900">
                    <Tags className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-n-700">
                    Nhãn hàng
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={activeBrand}
                    onChange={(e) =>
                      updateFilter("filter-brand", e.target.value)
                    }
                    className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/40 px-4 py-3 pr-11 text-sm font-medium text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                  >
                    {brands.map((brand) => (
                      <option key={brand.slug} value={brand.slug}>
                        {brand.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
                </div>
              </div>

              <div className="rounded-[28px] border border-p-100 bg-white p-4 shadow-sm transition hover:border-p-200">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-p-50 text-p-900">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-n-700">
                    Khoảng giá
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={activePrice}
                    onChange={(e) =>
                      updateFilter("filter-price", e.target.value)
                    }
                    className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/40 px-4 py-3 pr-11 text-sm font-medium text-n-800 outline-none transition focus:border-p-300 focus:bg-white"
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
                </div>
              </div>
            </div>
          </div>

          {hasAnyFilter && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="rounded-full border border-p-100 bg-p-50 px-4 py-2 text-sm font-semibold text-p-900 transition hover:bg-p-100"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-n-500">Kết quả hiển thị</p>
            <h2 className="text-2xl font-bold text-n-800">
              {filteredProducts.length} sản phẩm
            </h2>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-p-200 bg-p-50 px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-n-800">
              Không tìm thấy sản phẩm
            </h3>
            <p className="mt-2 text-sm text-n-500">
              Hiện chưa có sản phẩm nào phù hợp với bộ lọc đang chọn.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </section>
  );
}