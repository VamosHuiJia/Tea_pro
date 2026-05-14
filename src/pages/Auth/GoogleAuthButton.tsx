import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../api/shop/auth.api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

interface GoogleAuthButtonProps {
    text: string;
    setError: (error: string) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ text, setError }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { fetchUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                await loginWithGoogle(tokenResponse.access_token);
                await fetchUser();
                showToast("Đăng nhập bằng Google thành công!", "success");
                navigate("/");
            } catch (err: any) {
                showToast("Đăng nhập bằng Google thất bại!", "error");
                setError(err.response?.data?.message || err.message || "Đăng nhập Google thất bại");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            showToast("Đăng nhập bằng Google thất bại!", "error");
        }
    });

    return (
        <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-sm font-medium text-white transition hover:border-p-300/35 hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.44-3.39-7.44-7.56s3.345-7.56 7.44-7.56c2.33 0 3.886.99 4.785 1.845l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    />
                </svg>
            )}
            {isLoading ? "Đang xử lý..." : text}
        </button>
    );
};
