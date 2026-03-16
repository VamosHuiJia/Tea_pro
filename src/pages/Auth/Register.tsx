import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

const RegisterPage = () => {
    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Đăng ký nhanh để lưu thông tin mua hàng, nhận ưu đãi sớm và trải nghiệm tốt hơn."
            badge="Đăng ký"
            bottomText="Đã có tài khoản?"
            bottomLinkText="Đăng nhập"
            bottomLinkTo="/login"
        >
            <form className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="register-username"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            id="register-username"
                            type="text"
                            placeholder="huytra"
                            className="auth-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-fullname"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Họ và tên
                        </label>
                        <input
                            id="register-fullname"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className="auth-input"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="register-email"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Email
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="nhap@email.com"
                            className="auth-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-phone"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Số điện thoại
                        </label>
                        <input
                            id="register-phone"
                            type="tel"
                            placeholder="0123 456 789"
                            className="auth-input"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="register-password"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Mật khẩu
                        </label>
                        <input
                            id="register-password"
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            className="auth-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-confirm-password"
                            className="mb-1.5 block text-sm font-medium text-white/85"
                        >
                            Nhập lại mật khẩu
                        </label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className="auth-input"
                        />
                    </div>
                </div>

                <label className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-xs leading-5 text-white/75">
                    <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-white/30 accent-p-400"
                    />
                    <span>
                        Tôi đồng ý với{" "}
                        <Link to="/terms" className="text-p-200 transition hover:text-white">
                            điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link to="/privacy" className="text-p-200 transition hover:text-white">
                            bảo mật
                        </Link>
                        .
                    </span>
                </label>

                <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-p-400 via-p-500 to-p-600 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_rgba(18,137,99,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(18,137,99,0.45)]"
                >
                    Tạo tài khoản
                </button>
            </form>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    hoặc
                </span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm font-medium text-white transition hover:border-p-300/35 hover:bg-white/10"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.44-3.39-7.44-7.56s3.345-7.56 7.44-7.56c2.33 0 3.886.99 4.785 1.845l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    />
                </svg>
                Đăng ký với Google
            </button>
        </AuthLayout>
    );
};

export default RegisterPage;
