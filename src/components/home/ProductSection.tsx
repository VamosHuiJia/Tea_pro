import { useEffect } from "react";
import { initProductTabs } from "../../animations/productTabs";

const ProductSection = () => {
    useEffect(() => {
        const cleanup = initProductTabs();
        return cleanup;
    }, []);

    return (
        <section id="products">
            <div className="container">
                {/* <!-- Heading --> */}
                <div className="flex-col gap-9">
                    <div className="mb-10">
                        <h2 className="sub_heading">Tìm hiểu</h2>
                        <h1 className="main_heading">Sản Phẩm
                            <span className="text-gradient"> Trà Ngon</span>
                        </h1>
                    </div>
                </div>

                {/* <!-- Tab --> */}
                <div id="products-tabs">
                    <ul
                        className="flex bg-p-50 px-4 md:px-10 xl:px-[200px] py-4 md:py-6 gap-4 md:gap-8 justify-center mb-9 text-center">
                        <li>
                            <a href="#matcha" className="tab-link"><span>Trà</span> Match</a>
                        </li>
                        <li>|</li>
                        <li>
                            <a href="#whiteTea" className="tab-link"><span>Trà</span> Trắng</a>
                        </li>
                        <li>|</li>
                        <li>
                            <a href="#oolongTea" className="tab-link"><span>Trà</span> Ô Long</a>
                        </li>
                        <li>|</li>
                        <li>
                            <a href="#blackTea" className="tab-link"><span>Trà</span> Đen</a>
                        </li>
                    </ul>

                    {/* <!-- Fake data products introduction --> */}
                    <div id="matcha">
                        <div className="tabContainer">
                            <img src="../../../public/images/product_1.jpg" alt="matcha" className="productImg" />
                            <div>
                                <h3>Matcha Magic</h3>
                                <h4>
                                    Khám phá những lợi ích tiềm năng của "vàng xanh" từ Nhật Bản
                                </h4>
                                <p>
                                    Sẵn sàng nâng cao sức khỏe của bạn? Hãy làm quen với matcha,
                                    loại bột màu xanh lá cây rực rỡ đang làm khuynh đảo thế giới
                                    chăm sóc sức khỏe. Chứa đầy chất chống oxy hóa và chất dinh dưỡng,
                                    matcha cung cấp nguồn năng lượng mạnh mẽ mà không gây bồn chồn,
                                    nhờ sự kết hợp độc đáo giữa caffeine và L-theanine. <br />
                                    Loại trà này không chỉ tăng cường sự tập trung và trao đổi chất mà
                                    còn thêm hương vị thơm ngon cho sinh tố, đồ nướng và cà phê latte.
                                    Hãy đắm mình vào thế giới matcha và trải nghiệm cách siêu thực phẩm
                                    cổ xưa này có thể tiếp thêm sinh lực cho cơ thể và trí óc của bạn!
                                </p>
                                <button>
                                    <a href="" className="btn">Xem sản phẩm ngay
                                        <img src="../../../public/images/right-arrow.svg" alt="right-arrow" />
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="whiteTea">
                        <div className="tabContainer">
                            <img src="../../../public/images/product_2.jpg" alt="whiteTea" className="productImg" />
                            <div>
                                <h3>Tinh Chất Tinh Tế Từ Trà Trắng</h3>
                                <h4>
                                    Hành trình khám phá hương vị tinh khiết nhất từ thiên nhiên
                                </h4>
                                <p>
                                    Trà trắng, được tôn sùng vì sự nhẹ nhàng và tinh tế của nó,
                                    được chế biến từ lá non và nụ của cây Camellia sinensis.
                                    Với hương hoa nhẹ nhàng và vị ngọt tự nhiên, loại trà này
                                    mang đến trải nghiệm nhẹ nhàng nhưng sảng khoái. Giàu chất
                                    chống oxy hóa và ít caffeine, trà trắng không chỉ làm hài lòng
                                    khẩu vị mà còn hỗ trợ sức khỏe, khiến nó trở thành lựa chọn
                                    hoàn hảo cho những khoảnh khắc thư giãn hoặc trẻ hóa.
                                    Khám phá vẻ đẹp thanh bình của trà trắng và nâng tầm nghi
                                    thức uống trà của bạn lên một tầm cao mới.
                                </p>
                                <button>
                                    <a href="" className="btn">Xem sản phẩm ngay
                                        <img src="../../../public/images/right-arrow.svg" alt="right-arrow" />
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="oolongTea">
                        <div className="tabContainer">
                            <img src="../../../public/images/product_3.jpg" alt="oolongTea" className="productImg" />
                            <div>
                                <h3>Cuộc Cách Mạng Trà Ô Long</h3>
                                <h4>
                                    Mở khóa bí mật của loại trà lành mạnh nhất từ ​​thiên nhiên
                                </h4>
                                <p>
                                    Bạn có tò mò về bí quyết trường thọ và sống lâu không? Không cần tìm đâu xa, hãy tìm đến
                                    trà xanh! Thức uống cổ xưa này, được tôn sùng trong nhiều nền văn hóa trên thế giới,
                                    chứa đầy chất chống oxy hóa mạnh mẽ có thể thúc đẩy quá trình trao đổi chất, tăng cường
                                    chức năng não và thúc đẩy sức khỏe tim mạch. <br />
                                    Với hương vị tinh tế và vô số lợi ích cho sức khỏe, trà xanh không chỉ là một thức uống
                                    mà còn là một lựa chọn về lối sống. Hãy tham gia cuộc cách mạng trà xanh và khám phá
                                    cách thức pha chế đơn giản này có thể biến đổi sức khỏe của bạn từng ngụm một!
                                </p>
                                <button>
                                    <a href="" className="btn">Xem sản phẩm ngay
                                        <img src="../../../public/images/right-arrow.svg" alt="right-arrow" />
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="blackTea">
                        <div className="tabContainer">
                            <img src="../../../public/images/product_4.png" alt="blackTea" className="productImg" />
                            <div>
                                <h3>Đánh Thức Các Giác Quan Của Bạn Cùng Trà Đen
                                </h3>
                                <h4>
                                    Hương vị đậm đà truyền thống vượt thời gian
                                </h4>
                                <p>
                                    Hãy thưởng thức hương vị đậm đà, mạnh mẽ của trà đen, được chế tác hoàn hảo cho khẩu vị
                                    sành điệu. Mỗi ngụm trà mang đến sự pha trộn hài hòa giữa hương vị sâu lắng và hương
                                    thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ
                                    nghỉ trưa. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến
                                    trà đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.
                                </p>
                                <button>
                                    <a href="" className="btn">Xem sản phẩm ngay
                                        <img src="../../../public/images/right-arrow.svg" alt="right-arrow" />
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProductSection;