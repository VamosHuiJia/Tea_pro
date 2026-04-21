import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initProductTabs } from "../../../animations/productTabs";
import { getActiveCategories } from "../../../api/shop/category.api";
import { toSlug } from "../../../utils/slug";

interface Category {
    id: number;
    name: string;
    title: string | null;
    description: string | null;
    image: string | null;
    slug?: string;
}

const ProductSection = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getActiveCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const panelIds = categories.map(c => `#category-${c.id}`);
            const defaultTab = panelIds[0];
            const cleanup = initProductTabs({ panelIds, defaultTab });
            return cleanup;
        }
    }, [categories]);

    return (
        <section id="products">
            <div className="container">
                {/* <!-- Heading --> */}
                <div className="flex-col gap-9">
                    <div data-aos="fade-right"
                        className="mb-10">
                        <h2 className="sub_heading">Tìm hiểu</h2>
                        <h1 className="main_heading">Sản Phẩm
                            <span className="text-gradient"> Trà Ngon</span>
                        </h1>
                    </div>
                </div>

                {/* <!-- Tab --> */}
                <div id="products-tabs">
                    {categories.length > 0 ? (
                        <>
                            <ul className="flex flex-wrap bg-p-50 px-4 md:px-10 xl:px-[200px] py-4 md:py-6 gap-4 md:gap-8 justify-center mb-9 text-center">
                                {categories.map((category, index) => (
                                    <div key={category.id} className="flex gap-4 md:gap-8 items-center">
                                        <li>
                                            <a href={`#category-${category.id}`} className="tab-link whitespace-nowrap font-bold text-p-900">
                                                {category.name}
                                            </a>
                                        </li>
                                        {index < categories.length - 1 && <li className="text-p-400">|</li>}
                                    </div>
                                ))}
                            </ul>

                            {categories.map((category) => (
                                <div id={`category-${category.id}`} key={category.id}>
                                    <div className="tabContainer">
                                        {category.image ? (
                                            <img src={category.image} alt={category.name} className="productImg" />
                                        ) : (
                                            <img src="../../../../public/images/product_1.jpg" alt={category.name} className="productImg" />
                                        )}
                                        <div>
                                            <h3>{category.title || category.name}</h3>
                                            <p>{category.description}</p>
                                            <button>
                                                <Link to={`/products?filter-category=${category.slug || toSlug(category.name)}`} className="btn">Xem sản phẩm ngay
                                                    <img src="../../../../public/images/right-arrow.svg" alt="right-arrow" />
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Không có danh mục nào.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;