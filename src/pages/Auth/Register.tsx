import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { registerUser } from "../../api/shop/auth.api";
import { useToast } from "../../contexts/ToastContext";
import { GoogleAuthButton } from "./GoogleAuthButton";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser(username, email, password, phone);
            showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
            navigate("/login");
        } catch (err: any) {
            showToast("Đăng ký thất bại!", "error");
            setError(err.message || "Đăng ký thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Đăng ký nhanh để lưu thông tin mua hàng, nhận ưu đãi sớm và trải nghiệm tốt hơn."
            badge="Đăng ký"
            bottomText="Đã có tài khoản?"
            bottomLinkText="Đăng nhập"
            bottomLinkTo="/login"
        >
            <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                    <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 mb-3">
                        {error}
                    </div>
                )}
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
                            placeholder="Nhập tên tài khoản"
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                            placeholder="Nhập họ và tên"
                            className="auth-input"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            // required có thể thêm nếu muốn
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
                            placeholder="Nhập email của bạn"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            placeholder="Nhập số điện thoại"
                            className="auth-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
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
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-p-400 via-p-500 to-p-600 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_rgba(18,137,99,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(18,137,99,0.45)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </button>
            </form>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    hoặc
                </span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <GoogleAuthButton text="Đăng ký với Google" setError={setError} />
        </AuthLayout>
    );
};

export default RegisterPage;
