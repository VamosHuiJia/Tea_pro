const StatsSection = () => {
    return (
        <section id="stats"
            className="relative mt-20 bg-fixed bg-center bg-no-repeat bg-cover bg-[url(./assets/images/statsBg.jpg)]">
            <div className="absolute inset-0 bg-p-950/95"></div>

            <div
                className="container relative z-10 flex flex-col items-center justify-center px-4 py-20 lg:py-28 gap-14 lg:gap-32 md:flex-row">
                <div className="stats-item">
                    <h1 className="counter">
                        100+
                    </h1>
                    <h2>Hương Vị Pha Chế</h2>
                </div>

                {/* <!-- star line --> */}
                <svg viewBox="-1 -1 3 137" width="3" height="137" className="hidden md:block"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="-5.90104e-06" y2="135"
                            gradientUnits="userSpaceOnUse">
                            <stop stop-color="white" stop-opacity="0" />
                            <stop offset="0.494792" stop-color="white" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <line x1="0.5" y1="0" x2="0.5" y2="135" stroke="url(#lineGradient)" stroke-opacity="0.3" fill="none" />
                </svg>

                <div className="stats-item">
                    <h1 className="counter">
                        500k+
                    </h1>
                    <h2>Sản Phẩm Bán Ra Toàn Thế Giới</h2>
                </div>

                {/* <!-- star line --> */}
                <svg viewBox="-1 -1 3 137" width="3" height="137" className="hidden md:block"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="-5.90104e-06" y2="135"
                            gradientUnits="userSpaceOnUse">
                            <stop stop-color="white" stop-opacity="0" />
                            <stop offset="0.494792" stop-color="white" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <line x1="0.5" y1="0" x2="0.5" y2="135" stroke="url(#lineGradient)" stroke-opacity="0.3" fill="none" />
                </svg>

                <div className="stats-item">
                    <h1 className="counter">
                        4.9+
                    </h1>
                    <h2>Điểm Đánh Giá Từ Khách Hàng</h2>
                </div>
            </div>
        </section>
    );
};

export default StatsSection