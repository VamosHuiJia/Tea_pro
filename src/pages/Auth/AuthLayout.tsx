import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
}

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const panelVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.99,
    transition: {
      duration: 0.24,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badge,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <section className="fixed inset-0 z-[999] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={handleClose}
      />

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <motion.div
          layout
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/15 bg-[rgba(8,24,20,0.82)] shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="relative hidden min-h-[680px] overflow-hidden lg:block">
            <img
              src="/images/tea-bg.jpg"
              alt="Tea background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/40 to-p-950/80" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
              <motion.span
                variants={childVariants}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white/85 backdrop-blur-md"
              >
                <span className="h-2 w-2 rounded-full bg-p-300" />
                Trải nghiệm mua sắm
              </motion.span>

              <motion.div variants={childVariants} className="max-w-sm">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">
                  Tea shop experience
                </p>

                <h2 className="text-3xl font-bold leading-tight text-white xl:text-[38px]">
                  Không gian mua sắm trà hiện đại, nhẹ nhàng và tinh tế.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/72">
                  Panel bên trái được giữ cố định để khi chuyển giữa Đăng nhập và Đăng ký,
                  bố cục luôn ổn định, không còn cảm giác ảnh lúc to lúc nhỏ.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ["100%", "Tự nhiên"],
                    ["24/7", "Hỗ trợ"],
                    ["4.9★", "Đánh giá"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md"
                    >
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="mt-1 text-xs text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative flex min-h-[680px] flex-col bg-[linear-gradient(180deg,rgba(13,71,56,0.94)_0%,rgba(6,40,32,0.98)_100%)]">
            <button
              onClick={handleClose}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 transition hover:bg-white/12 hover:text-white"
            >
              <CloseIcon />
            </button>

            <div className="flex h-full items-center justify-center px-5 py-6 sm:px-8 lg:px-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] as const }}
                  className="w-full max-w-[420px]"
                >
                  <motion.div
                    variants={childVariants}
                    initial="initial"
                    animate="animate"
                    className="mb-5"
                  >
                    <span className="inline-flex items-center rounded-full border border-p-300/25 bg-p-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-p-100">
                      {badge}
                    </span>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-[30px]">
                      {title}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-white/68">
                      {subtitle}
                    </p>
                  </motion.div>

                  {children}

                  <p className="mt-5 text-center text-sm text-white/68">
                    {bottomText}{" "}
                    <Link
                      to={bottomLinkTo}
                      state={{ backgroundLocation: location.state?.backgroundLocation }}
                      className="font-semibold text-p-200 underline decoration-white/20 underline-offset-4 transition hover:text-white"
                    >
                      {bottomLinkText}
                    </Link>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};