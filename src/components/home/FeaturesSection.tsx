const FeaturesSection = () => {
    return (
        <section id="features">
        <div className="container relative m-20 text-center">
            {/* <!-- Hàng 1 cho large screen --> */}
            <div className="flex flex-col items-center justify-center w-full gap-0 lg:gap-10 lg:flex-row">
                {/* <!-- Holigon 1  --> */}
                <div className="feature-card group bg-[url(../../public/images/benefit_1.jpg)]">
                    <div className="feature-filter"></div>

                    <h3 className="uppercase">Nguồn cung cao cấp</h3>
                    <p>Chúng tôi tự hào sản xuất trà ngay tại Hoa Kỳ, sử dụng nguyên liệu chất lượng cao từ các trang
                        trại địa phương.
                    </p>
                </div>

                {/* <!-- Holigon 2 --> */}
                <div className="order-first bg-p-50 feature-card lg:order-none lg:bg-transparent">
                    <div>
                        <h2 className="sub_heading">
                            Tại sao chọn chúng tôi ?
                        </h2>
                        <h1 className="leading-loose text-center main_heading">Sự
                            <span className="text-gradient"> Độc Đáo </span>
                            Từ <br/>Huy bán Trà
                        </h1>
                    </div>
                </div>

                {/* <!-- Holigon 3 --> */}
                <div className="feature-card group bg-[url(../../public/images/benefit_2.jpg)]">
                    <div className="feature-filter"></div>

                    <h3 className="uppercase">Hương vị pha chế độc đáo</h3>
                    <p>Sản phẩm độc quyền của chúng tôi gồm các loại trà được với hương vị độc đáo, được chế tác để làm
                        hài lòng mọi khẩu vị.
                    </p>
                </div>
            </div>

            {/* <!-- Hàng 2 cho large screen --> */}
            <div className="flex flex-col items-center justify-center w-full lg:-mt-16 lg:gap-10 lg:flex-row">
                {/* <!-- Holigon 4 --> */}
                <div className="feature-card group bg-[url(../../public/images/benefit_3.jpg)]">
                    <div className="feature-filter"></div>

                    <h3 className="uppercase">Tập trung vào sức khỏe</h3>
                    <p>Hãy thưởng thức các loại trà tốt cho sức khỏe của chúng tôi, được pha chế cẩn thận để hỗ trợ trí
                        óc, cơ thể và tâm hồn của bạn.
                    </p>
                </div>

                {/* <!-- Holigon 5 --> */}
                <div className="feature-card group bg-[url(../../public/images/benefit_4.jpg)]">
                    <div className="feature-filter"></div>

                    <h3 className="uppercase">Trải nghiệm cá nhân hóa</h3>
                    <p>Trải nghiệm dịch vụ được cá nhân hóa với mọi đơn hàng, phù hợp với sở thích và nhu cầu trà riêng
                        của bạn.
                    </p>
                </div>
            </div>
        </div>
    </section>
    );
};

export default FeaturesSection