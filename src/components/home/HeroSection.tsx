// src/components/home/HeroSection.tsx
import "./../../App.css"

const HeroSection = () => {
    return (
        <section
            id="hero"
            className="h-screen max-h-[1100px] bg-gradient-to-t from-p-100 to-white overflow-y-clip"
        >
            <div className="container relative flex items-center justify-center w-full h-full xl:justify-start">
                <div className="absolute bottom-0 right-0 z-0 overflow-hidden md:-bottom-40 xl:top-1/2 xl:-translate-y-1/2 ">
                    <img
                        src="../../../public/images/hero_img.png"
                        alt="hero_img"
                        className="h-full 2xl:[mask-image:linear-gradient(to_left,transparent,black_10%)]"
                    />
                </div>

                <div className="z-10 flex flex-col items-center justify-center gap-4 md:gap-9 xl:items-start">
                    <div>
                        <h2 className="mb-2 text-xs font-semibold leading-none tracking-wider text-center uppercase font-inter md:text-sm xl:text-start">
                             
                            <span className="text-xs text-gradient md:text-sm ">
                                Hơn một trăm hương vị trà
                            </span>
                            
                        </h2>
                        <h1 className="text-5xl leading-none tracking-wide text-center capitalize font-lobster text-p-950 md:text-6xl lg:text-7xl">
                            Trà Đặc Biệt Chế Tác
                        </h1>
                    </div>

                    <p className="max-w-xl px-4 text-center text-n-700 md:px-0 xl:text-start">
                        Sứ mệnh của chúng tôi là mang đến cho bạn sự yên bình và kết nối
                        thông qua các hương vị trà được chọn lọc cẩn thận và được tạo ra
                        để nâng cao trải nghiệm hàng ngày và sức khoẻ toàn diện cho bạn.
                    </p>

                    <button>
                        <a className="btn" href="#products">
                            Tìm hiểu sản phẩm
                            <img
                                src="../../../public/images/right-arrow.svg"
                                alt="right-arrow"
                            />
                        </a>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;


