import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { loginUser } from "../../api/shop/auth.api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { fetchUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginUser(email, password);

      await fetchUser();

      showToast("Đăng nhập thành công!", "success");
      navigate("/");
    } catch (err: any) {
      showToast("Đăng nhập thất bại!", "error");
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng bạn"
      subtitle="Đăng nhập để tiếp tục theo dõi đơn hàng, lưu sản phẩm yêu thích và mua sắm nhanh hơn."
      badge="Đăng nhập"
      bottomText="Chưa có tài khoản?"
      bottomLinkText="Tạo tài khoản"
      bottomLinkTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-white/85"
          >
            Email hoặc tên đăng nhập
          </label>
          <input
            id="login-email"
            type="text"
            placeholder="Nhập email của bạn"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-white/85"
            >
              Mật khẩu
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-p-200 transition hover:text-white"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <input
            id="login-password"
            type="password"
            placeholder="Nhập mật khẩu"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 accent-p-400"
            />
            Ghi nhớ đăng nhập
          </label>

          <p className="text-[11px] text-white/50">Bảo mật tối ưu</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-p-400 via-p-500 to-p-600 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_rgba(18,137,99,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(18,137,99,0.45)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
        Tiếp tục với Google
      </button>
    </AuthLayout>
  );
};

export default LoginPage;