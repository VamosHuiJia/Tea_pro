import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,          // trigger khi thấy ~30% section
    triggerOnce: true,       // chỉ chạy animation 1 lần
  });

  return (
    <section
      id="stats"
      ref={ref}
      className="relative mt-20 bg-fixed bg-center bg-no-repeat bg-cover bg-[url(./assets/images/statsBg.jpg)]"
    >
      <div className="absolute inset-0 bg-p-950/95"></div>

      <div className="container relative z-10 flex flex-col items-center justify-center px-4 py-20 lg:py-28 gap-14 lg:gap-32 md:flex-row">
        {/* Stat 1 */}
        <div className="text-center stats-item">
          <h1 className="text-6xl lg:text-8xl font-lobster tracking-wider leading-none font-bold text-transparent bg-clip-text bg-[linear-gradient(24deg,rgba(255,255,255,1)_40%,rgba(121,220,180,1)_100%)]">
            {inView ? <CountUp start={0} end={100} duration={2.5} delay={0.2} /> : 0}+
          </h1>
          <h2 className="mt-2 text-xs lg:text-base text-white/50">Hương Vị Pha Chế</h2>
        </div>

        {/* Star line (giữ nguyên) */}
        <svg
          viewBox="-1 -1 3 137"
          width="3"
          height="137"
          className="hidden md:block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="-5.90104e-06" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.494792" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0.5" y1="0" x2="0.5" y2="135" stroke="url(#lineGradient)" strokeOpacity="0.3" fill="none" />
        </svg>

        {/* Stat 2 */}
        <div className="text-center stats-item">
          <h1 className="text-6xl lg:text-8xl font-lobster tracking-wider leading-none font-bold text-transparent bg-clip-text bg-[linear-gradient(24deg,rgba(255,255,255,1)_40%,rgba(121,220,180,1)_100%)]">
            {inView ? <CountUp start={0} end={500000} duration={2.5} delay={0.4} formattingFn={(value) => `${Math.floor(value / 1000)}k`} /> : '0k'}+
          </h1>
          <h2 className="mt-2 text-xs lg:text-base text-white/50">Sản Phẩm Bán Ra Toàn Thế Giới</h2>
        </div>

        {/* Star line */}
        <svg
          viewBox="-1 -1 3 137"
          width="3"
          height="137"
          className="hidden md:block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Giữ nguyên như trên */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="-5.90104e-06" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.494792" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0.5" y1="0" x2="0.5" y2="135" stroke="url(#lineGradient)" strokeOpacity="0.3" fill="none" />
        </svg>

        {/* Stat 3 */}
        <div className="text-center stats-item">
          <h1 className="text-6xl lg:text-8xl font-lobster tracking-wider leading-none font-bold text-transparent bg-clip-text bg-[linear-gradient(24deg,rgba(255,255,255,1)_40%,rgba(121,220,180,1)_100%)]">
            {inView ? <CountUp start={0} end={4.9} decimals={1} duration={2.5} delay={0.6} /> : '0.0'}+
          </h1>
          <h2 className="mt-2 text-xs lg:text-base text-white/50">Điểm Đánh Giá Từ Khách Hàng</h2>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;