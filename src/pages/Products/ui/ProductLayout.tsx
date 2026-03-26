import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { productList } from "../../../animations/data";

export default function ProductLayout() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("filter-category") || "all";

    const categories = useMemo(() => {
        const mapped = productList.map((item) => item.category);
        const unique = mapped.filter(
            (category, index, arr) =>
                arr.findIndex((c) => c.slug === category.slug) === index
        );

        return [{ id: 0, name: "Tất cả", slug: "all" }, ...unique];
    }, []);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "all") return productList;
        return productList.filter(
            (product) => product.category.slug === activeCategory
        );
    }, [activeCategory]);

    const handleFilterChange = (slug: string) => {
        if (slug === "all") {
            setSearchParams({});
            return;
        }

        setSearchParams({ "filter-category": slug });
    };

    return (
        <section id="products">
            <main className="container mt-10">
                <img
                    data-aos="flip-up"
                    src="../../../../public/images/banners/banner2.jpg"
                    alt="products banner"
                    className="w-full h-[350px] object-cover shadow-xl"
                />

                <div className="mt-8 flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const isActive = activeCategory === category.slug;

                        return (
                            <button
                                key={category.slug}
                                type="button"
                                onClick={() => handleFilterChange(category.slug)}
                                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${isActive
                                        ? "border-p-900 bg-p-900 text-white"
                                        : "border border-p-100 bg-white text-n-700 hover:bg-p-50"
                                    }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
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
                            Hiện chưa có sản phẩm nào trong danh mục này.
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