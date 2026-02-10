const BestSellersSection = () => {
    return (
        <section id="best-sellers">
            <div className="container my-20">
                {/* <!-- title --> */}
                <div className="flex flex-col items-start md:items-start lg:items-start">
                    <div>
                        <h2 className="sub_heading">Khách hàng yêu thích</h2>
                        <h2 className="main_heading">
                            Những Sản Phẩm <span className="text-gradient">Bán Chạy Nhất</span>
                        </h2>
                    </div>

                    <p className="max-w-lg mt-2 text-xs text-start md:text-start lg:text-start text-n-500">
                        Khám phá những sản phẩm bán chạy nhất của chúng tôi, nơi chất lượng kết hợp hương vị trong mỗi tách
                        trà. Hãy tham gia cùng hàng ngàn khách hàng hài lòng đã biến những hỗn hợp này thành sở thích của họ
                        và nâng tầm thời gian uống trà của bạn ngay hôm nay!
                    </p>
                </div>

                {/* <!-- list fake data products --> */}
                <div className="lg:px-4 md:x-2 mt-9 slider">
                    {/* <!-- Product 1 --> */}
                    <div className="!flex flex-col lg:flex-row items-center justify-between">
                        {/* <!-- Mục trái --> */}
                        <div className="flex-1 best-product--left">
                            {/* <!-- Product 1 information --> */}
                            <div className="best-product-info">
                                <h3>Peppermint Velvet</h3>
                                <p>
                                    Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái,
                                    khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi
                                    chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà
                                    đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.
                                </p>
                            </div>

                            {/* <!-- Progress bar --> */}
                            <div className="benefit-bars" id="firstbar">
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường năng lượng và tập trung
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">Giàu chất chống oxy hoá
                                        </h4>
                                        <div progress-bar data-percentage="93%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường trao đổi chất
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Thúc đẩy sự bình tĩnh và thư giãn
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Mục phải --> */}
                        <div>
                            <img src=".../../assets/images/products/matcha1.jpg" alt="best-sellers-product" />
                        </div>
                    </div>

                    {/* <!-- Product 2 --> */}
                    <div className="!flex flex-col lg:flex-row items-center justify-between">
                        {/* <!-- Mục trái --> */}
                        <div className="flex-1 best-product--left">
                            {/* <!-- Product 1 information --> */}
                            <div className="best-product-info">
                                <h3>Chamomile Blisst</h3>
                                <p>
                                    Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái,
                                    khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi
                                    chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà
                                    đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.
                                </p>
                            </div>

                            {/* <!-- Progress bar --> */}
                            <div className="benefit-bars" id="firstbar">
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường năng lượng và tập trung
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">Giàu chất chống oxy hoá
                                        </h4>
                                        <div progress-bar data-percentage="93%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường trao đổi chất
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Thúc đẩy sự bình tĩnh và thư giãn
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Mục phải --> */}
                        <div>
                            <img src="../../assets/images/products/blacktea1.jpg" alt="best-sellers-product" />
                        </div>
                    </div>

                    {/* <!-- Product 3 --> */}
                    <div className="!flex flex-col lg:flex-row items-center justify-between">
                        {/* <!-- Mục trái --> */}
                        <div className="flex-1 best-product--left">
                            {/* <!-- Product 1 information --> */}
                            <div className="best-product-info">
                                <h3>Lemon Ginger Zest</h3>
                                <p>
                                    Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái,
                                    khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi
                                    chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà
                                    đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.
                                </p>
                            </div>

                            {/* <!-- Progress bar --> */}
                            <div className="benefit-bars" id="firstbar">
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường năng lượng và tập trung
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">Giàu chất chống oxy hoá
                                        </h4>
                                        <div progress-bar data-percentage="93%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường trao đổi chất
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Thúc đẩy sự bình tĩnh và thư giãn
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Mục phải --> */}
                        <div>
                            <img src="../../assets/images/products/whitetea1.jpg" alt="best-sellers-product" />
                        </div>
                    </div>

                    {/* <!-- Product 4 --> */}
                    <div className="!flex flex-col lg:flex-row items-center justify-between">
                        {/* <!-- Mục trái --> */}
                        <div className="flex-1 best-product--left">
                            {/* <!-- Product 1 information --> */}
                            <div className="best-product-info">
                                <h3>Mystic Earl Grey</h3>
                                <p>
                                    Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái,
                                    khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi
                                    chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà
                                    đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.
                                </p>
                            </div>

                            {/* <!-- Progress bar --> */}
                            <div className="benefit-bars" id="firstbar">
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường năng lượng và tập trung
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">Giàu chất chống oxy hoá
                                        </h4>
                                        <div progress-bar data-percentage="93%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Tăng cường trao đổi chất
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 progressbar-item">
                                        <h4 className="progress-title">
                                            Thúc đẩy sự bình tĩnh và thư giãn
                                        </h4>
                                        <div progress-bar data-percentage="94%">
                                            <div className="progress-number">
                                                <div className="progress-number-mark">
                                                    <span className="percent"></span>
                                                    <span className="down-arrow"></span>
                                                </div>
                                            </div>
                                            <div className="progress-bg">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Mục phải --> */}
                        <div>
                            <img src=".../../assets/images/products/oolong1.jpg" alt="best-sellers-product" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestSellersSection