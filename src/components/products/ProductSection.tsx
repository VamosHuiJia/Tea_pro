import { useEffect, useState } from 'react';
import { productList } from '../../animations/data';

const ProductSection = () => {
    const [filter, setFilter] = useState<string>('all');

    // filter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('filter-category') || 'all';
        setFilter(category);
    }, []);

    // category
    const filteredProducts =
        filter === 'all'
            ? productList
            : productList.filter((p) => p.category === filter);

    return (
        <section id="products">
            <main className="container mt-20">
                {/* banner */}
                <img
                    data-aos="flip-up"
                    src="../../../public/images/banners/banner1.jpg"
                    alt="products banner"
                    className="w-full h-[350px] object-cover shadow-xl"
                />

                {/* tiêu đề */}
                <div className="mt-4 md:mt-9">
                    <div data-aos="fade-right">
                        <h2 className="sub_heading">Shop with us</h2>
                        <h1 className="main_heading">Tất cả sản phẩm</h1>
                    </div>

                    <p
                        data-aos="fade-right"
                        data-aos-delay="100"
                        className="max-w-lg mt-2 text-xs text-n-500"
                    >
                        Cho dù bạn là người đam mê trà lâu năm hay mới bước chân vào thế giới trà, chúng tôi ở đây để giúp bạn khám phá loại trà pha trộn yêu thích tiếp theo của mình. Khám phá bộ sưu tập của chúng tôi và trải nghiệm nghệ thuật pha trà trong từng ngụm.
                    </p>
                </div>

                {/* filter tabs */}
                <div
                    id="allProduct-filters"
                    className="flex gap-8 mt-4 md:mt-9"
                >
                    <a
                        href="?filter-category=all"
                        className={`tab-link ${filter === 'all' ? 'activeFilter' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Tất cả <span className="hidden md:inline">sản phẩm</span>
                    </a>

                    <a
                        href="?filter-category=blacktea"
                        className={`tab-link ${filter === 'blacktea' ? 'activeFilter' : ''}`}
                        onClick={() => setFilter('blacktea')}
                    >
                        <span className="hidden md:inline">Trà</span> đen
                    </a>

                    <a
                        href="?filter-category=whitetea"
                        className={`tab-link ${filter === 'whitetea' ? 'activeFilter' : ''}`}
                        onClick={() => setFilter('whitetea')}
                    >
                        <span className="hidden md:inline">Trà</span> trắng
                    </a>

                    <a
                        href="?filter-category=oolong"
                        className={`tab-link ${filter === 'oolong' ? 'activeFilter' : ''}`}
                        onClick={() => setFilter('oolong')}
                    >
                        <span className="hidden md:inline">Trà</span> ô long
                    </a>

                    <a
                        href="?filter-category=matcha"
                        className={`tab-link ${filter === 'matcha' ? 'activeFilter' : ''}`}
                        onClick={() => setFilter('matcha')}
                    >
                        <span className="hidden md:inline">Trà</span> matcha
                    </a>
                </div>

                {/* sản phẩm */}
                <section id="product-wrapper">
                    <div className="mt-9">
                        <div
                            id="product-items--container"
                            className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-4"
                        >
                            {filteredProducts.length === 0 ? (
                                <p className="py-10 text-center col-span-full text-n-500">
                                    Không tìm thấy sản phẩm nào...
                                </p>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden transition-all duration-300 bg-white shadow-md group rounded-xl hover:shadow-xl"
                                    >
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            className="object-cover w-full h-56 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="product-details">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
};

export default ProductSection;