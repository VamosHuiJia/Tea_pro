const ContactSection = () => {
    return (
        <section id="contact">
            <div className="container my-20">
                <div className="flex flex-col w-full gap-10 lg:flex-row">
                    {/* <!-- Thông tin liên hệ --> */}
                    <div
                        className="flex h-[515px] flex-col items-center justify-center flex-1 w-full px-10 py-20 border-4 rounded-4xl border-dotted border-p-600 gap-9">
                        {/* <!-- Heading --> */}
                        <div>
                            <h2 className="sub_heading">
                                Có câu hỏi ?
                            </h2>
                            <h1 className="main_heading"> Liên hệ với
                                <span className="text-gradient">Huy bán trà</span>
                                tại
                            </h1>
                        </div>

                        {/* <!-- địa chỉ --> */}
                        <div className="contact-info">
                            <div>
                                <img src="../../assets/images/building.svg" alt="building" className="size-4" />
                                <h1>Địa Chỉ</h1>
                            </div>

                            <p>
                                32A Tôn Đức Thắng, Đống Đa, Hà Nội ( Ngã 3 Hàng Cháo - Đối Diện Văn Miếu Quốc Tử Giám )
                            </p>
                        </div>

                        {/* <!-- email --> */}
                        <div className="contact-info">
                            <div>
                                <img src="../../assets/images/mail.svg" alt="building" className="size-4" />
                                <h1>Email</h1>
                            </div>

                            <p>huybantra.teashop@example.com</p>
                        </div>

                        {/* <!-- số điện thoại --> */}
                        <div className="contact-info">
                            <div>
                                <img src="../../assets/images/phone.svg" alt="building" className="size-4" />
                                <h1>Điện Thoại</h1>
                            </div>

                            <p>(+84) 686 125 80</p>
                        </div>
                    </div>

                    {/* <!-- form đăng ký theo dõi --> */}
                    <div
                        className="relative text-center flex flex-col items-center w-full flex-1 h-[515px] px-10 py-20 gap-9 border-3 rounded-4xl border-p-600 overflow-clip">
                        {/* <!-- heading --> */}
                        <div>
                            <h2 className="sub_heading">Cập nhập bản tin</h2>
                            <h1 className="main_heading">Đăng ký theo dõi</h1>
                        </div>

                        <p>Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin.</p>

                        {/* <!-- email --> */}
                        <div className="relative w-[250px] md:w-[350px]">
                            <input type="email" placeholder="Nhập địa chỉ email của bạn"
                                className="w-full px-12 py-3 border border-p-600" />
                            <img src="../../assets/images/mail2.svg" alt="mail icon"
                                className="absolute -translate-y-1/2 top-1/2 left-4" />
                        </div>

                        {/* <!-- Theo dõi --> */}
                        <button className="flex-none !border-p-600 w-[250px] md:w-[350px]">
                            <div className="capitalize btn !bg-p-600 hover:!bg-p-700">
                                <span className="w-full text-center">Đồng Ý Theo Dõi</span>
                            </div>
                        </button>

                        {/* <!-- decor --> */}
                        <img src="../../assets/images/contact.png" alt="decor"
                            className="absolute -bottom-20 -right-20 w-[400px] opacity-15 -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection