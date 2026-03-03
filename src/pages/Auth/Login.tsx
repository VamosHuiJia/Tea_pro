// src/pages/Auth/Login.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Overlay gradient nhẹ */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-n-900/30 via-p-950/20 to-n-900/30" />

            {/* Card chính - chia 50/50 trên lg */}
            <div
                className={`relative w-full max-w-[1000px] lg:max-w-[1100px] mx-4 sm:mx-6 lg:mx-8 grid lg:grid-cols-2 overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 min-h-[580px] lg:min-h-[720px]`}
            >
                {/* Bên trái - Ảnh nền trà (ẩn trên mobile & tablet) */}
                <div className="relative hidden overflow-hidden lg:block">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
                    <img
                        src="../../../public/images/tea-bg.jpg"
                        alt="Tea aesthetic background"
                        className="absolute inset-0 object-cover w-full h-full transition-transform duration-1000 scale-105 hover:scale-110"
                    />
                    <div className="absolute z-20 top-10 left-10">
                        <p className="text-5xl capitalize font-lobster text-p-900 drop-shadow-lg">
                            Huy bán Trà
                        </p>
                        <p className="mt-2 text-lg font-light text-white/80">
                            Trà ngon – Tâm an
                        </p>
                    </div>
                </div>

                {/* Bên phải - Form đăng nhập - nền xanh đậm */}
                <div
                    className={`relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-16 bg-p-900/90 backdrop-blur-md border-l border-white/5 lg:border-l-0`}
                >
                    {/* Nút đóng */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute z-20 transition-all duration-200 border-none outline-none top-5 right-5 sm:top-6 sm:right-6 hover:scale-110 active:scale-95 focus:outline-none ring-0 focus:ring-0"
                        aria-label="Đóng"
                    >
                        <img
                            src="/images/close.png"
                            alt="Close"
                            className="pointer-events-none w-7 h-7 sm:w-8 sm:h-8 opacity-80 hover:opacity-100"
                        />
                    </button>

                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Đăng nhập
                    </h1>
                    <p className="mb-8 text-base leading-relaxed sm:text-lg text-white/70">
                        "Nâng trà thưởng nguyệt đêm thâu. Tìm trong tĩnh lặng một màu an nhiên."
                    </p>

                    {/* Email */}
                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Email hoặc tên đăng nhập"
                            className={`w-full px-5 py-4 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-p-400/70 focus:ring-2 focus:ring-p-400/20 focus:bg-white/12 transition-all duration-300 text-base`}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className={`w-full px-5 py-4 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-p-400/70 focus:ring-2 focus:ring-p-400/20 focus:bg-white/12 transition-all duration-300 text-base`}
                        />
                    </div>

                    {/* Checkbox + Quên mật khẩu */}
                    <div className="flex flex-col justify-between gap-4 mb-8 text-sm sm:flex-row text-white/80">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-5 h-5 transition-colors rounded border-white/30 bg-white/5 checked:bg-p-500 checked:border-p-400 focus:ring-offset-0 accent-p-500"
                            />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>

                        <Link
                            to="/forgot-password"
                            className="underline transition-colors text-p-300 hover:text-p-200 underline-offset-4"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Nút Đăng nhập - màu sáng nổi bật trên nền xanh đậm */}
                    <button
                        className={`w-full py-4 rounded-xl font-semibold text-base sm:text-lg bg-gradient-to-r from-p-600 to-p-500 hover:from-p-400 hover:via-p-200 hover:to-p-300 text-n-900 shadow-lg shadow-p-950/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2.5`}
                    >
                        <h1 className="text-amber-50">ĐĂNG NHẬP</h1>

                    </button>

                    {/* Phân cách + Google */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-white/15"></div>
                        <span className="px-4 text-sm text-white/50">hoặc</span>
                        <div className="flex-1 h-px bg-white/15"></div>
                    </div>

                    <button
                        className={`w-full py-4 px-6 rounded-xl font-medium text-base bg-white/8 border border-white/15 hover:bg-white/12 hover:border-p-400/40 text-white flex items-center justify-center gap-3 transition-all duration-250 active:scale-[0.98]`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.44-3.39-7.44-7.56s3.345-7.56 7.44-7.56c2.33 0 3.886.99 4.785 1.845l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                            />
                        </svg>
                        Tiếp tục với Google
                    </button>

                    {/* Link đăng ký */}
                    <p className="mt-8 text-sm text-center text-white/70">
                        Chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            className="font-medium underline transition-colors text-p-300 hover:text-p-200 underline-offset-4"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;