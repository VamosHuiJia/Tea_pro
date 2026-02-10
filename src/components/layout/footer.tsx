// src/components/layout/footer.tsx

const Footer = () => {
  return (
    <footer className="bg-p-950 text-n-200">
      <div className="container px-6 py-24 mx-auto">
        <div className="grid gap-14 lg:grid-cols-3">

          <div>
            <h2 className="mb-6 text-3xl font-bold text-p-200">
              Huy Bán Trà
            </h2>
            <p className="max-w-sm leading-relaxed text-white/60">
              Chúng tôi chọn lọc những búp trà tinh túy từ cao nguyên Việt Nam,
              gìn giữ hương vị thuần khiết và mang đến trải nghiệm thưởng trà
              chậm rãi, sâu lắng.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Cam kết của chúng tôi
            </h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li>🍃 100% trà nguyên chất</li>
              <li>🌱 Canh tác bền vững</li>
              <li>☕ Rang & ủ thủ công</li>
              <li>🚚 Giao hàng toàn quốc</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Khám phá
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="transition hover:text-p-300">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-p-300">
                  Cửa hàng
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-p-300">
                  Blog trà
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-p-300">
                  Chính sách
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="h-px my-16 bg-white/10"></div>

        <div className="flex flex-col items-center justify-between gap-6 text-sm text-white/40 md:flex-row">
          <p>© 2025 Huy Bán Trà. All rights reserved.</p>

          <div className="flex items-center gap-8">
            <a href="#" className="transition hover:text-p-300">
              Facebook
            </a>
            <a href="#" className="transition hover:text-p-300">
              Instagram
            </a>
            <a href="#" className="transition hover:text-p-300">
              TikTok
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
