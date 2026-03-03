// src/components/layout/footer.tsx

const Footer = () => {
  return (
    <footer className="bg-p-950 text-n-200">
      <div className="container px-6 py-20 mx-auto lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12">

          {/* Brand + Mô tả + Social */}
          <div className="max-w-sm">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-p-200 font-lobster">
              Huy Bán Trà
            </h2>
            <p className="mb-8 leading-relaxed text-white/70">
              Chúng tôi trân trọng từng búp trà tinh hoa từ cao nguyên Việt Nam, gìn giữ hương vị thuần khiết và lan tỏa nghệ thuật thưởng trà chậm rãi, sâu lắng.
            </p>

            <div className="flex items-center gap-5 mt-8 md:gap-6">
              <a
                href="https://www.facebook.com/nguyen.huy.291472" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-transform hover:scale-110"
              >
                <img
                  src="../../../public/images/facebook.png"
                  alt="Facebook"
                  className="object-contain transition-opacity w-7 h-7 md:w-8 md:h-8 opacity-80 hover:opacity-100"
                />
              </a>

              <a
                href="https://www.instagram.com/mitom20097" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-transform hover:scale-110"
              >
                <img
                  src="../../../public/images/instagram.png"
                  alt="Instagram"
                  className="object-contain transition-opacity w-7 h-7 md:w-8 md:h-8 opacity-80 hover:opacity-100"
                />
              </a>

              <a
                href="https://www.tiktok.com/@jahuiiiiiiiii04" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition-transform hover:scale-110"
              >
                <img
                  src="../../../public/images/tiktok.png"
                  alt="TikTok"
                  className="object-contain transition-opacity w-7 h-7 md:w-8 md:h-8 opacity-80 hover:opacity-100"
                />
              </a>
            </div>
          </div>

          {/* Cam kết */}
          <div>
            <h3 className="mb-6 text-xl font-semibold tracking-wide text-white uppercase">
              Cam kết
            </h3>
            <ul className="space-y-4 text-sm text-white/65">
              <li className="flex items-center gap-3"><span>🍃</span> 100% trà nguyên chất, không phụ gia</li>
              <li className="flex items-center gap-3"><span>🌱</span> Canh tác bền vững</li>
              <li className="flex items-center gap-3"><span>☕</span> Rang xay & ủ thủ công</li>
              <li className="flex items-center gap-3"><span>🚚</span> Giao hàng nhanh toàn quốc</li>
            </ul>
          </div>

          {/* Khám phá */}
          <div>
            <h3 className="mb-6 text-xl font-semibold tracking-wide text-white uppercase">
              Khám phá
            </h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/about" className="transition-colors hover:text-p-300">Về chúng tôi</a></li>
              <li><a href="/shop" className="font-semibold transition-colors hover:text-p-300 text-p-300">Cửa hàng</a></li> {/* Nổi bật shop */}
              <li><a href="/blog" className="transition-colors hover:text-p-300">Blog trà</a></li>
              <li><a href="/policy" className="transition-colors hover:text-p-300">Chính sách</a></li>
              <li><a href="/faq" className="transition-colors hover:text-p-300">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Liên hệ + Newsletter */}
          <div>
            <h3 className="mb-6 text-xl font-semibold tracking-wide text-white uppercase">
              Liên hệ ngay
            </h3>
            <div className="space-y-4 text-sm text-white/65">
              <p>Hotline: <a href="tel:1900xxxx" className="hover:text-p-300">(+84) 686 125 80</a></p>
              <p>Email: <a href="mailto:hello@huybantra.vn" className="hover:text-p-300">huybantra.teashop@example.com</a></p>
              <p className="pt-4 font-medium">Mua ngay tại shop online hoặc inbox Fanpage để được tư vấn!</p>
            </div>
          </div>

        </div>

        <div className="h-px my-16 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-6 text-sm text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Huy Bán Trà. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="/privacy" className="transition-colors hover:text-p-300">Bảo mật</a>
            <a href="/terms" className="transition-colors hover:text-p-300">Điều khoản</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;