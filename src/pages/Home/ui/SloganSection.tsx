const SloganSection = () => {
    return (
        <section id="slogan" className="mt-20 overflow-clip">
            <div className="relative min-w-full h-[30vh] max-h-[276px] overflow-hidden flex justify-center items-center">
                <video
                    className="absolute inset-0 min-w-full min-h-full -z-10 md:top-[-20%] md:left-[-50%] md:translate-x-1/2"
                    src="/images/tea-farmer.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                />

                <p
                    className="px-4 text-base tracking-wide text-center text-white md:text-2xl text-shadow-[2px_2px_8px_#000000]">
                    Chỉ những lá trà ngon nhất mới được đưa vào sản phẩm của chúng tôi, <br className="hidden lg:block" />
                    đảm bảo mỗi ngụm trà đều mang hương vị tinh khiết và tuyệt hảo.
                </p>
            </div>
        </section>
    );
};

export default SloganSection