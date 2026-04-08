import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { showToast } = useToast();
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const [shouldRedirectLogin, setShouldRedirectLogin] = useState(false);
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false);

  const isAuth = !!user;
  let isAuthz = true;
  if (isAuth && allowedRoles && allowedRoles.length > 0) {
    const roleLvl = user?.roleLevel || user?.role?.level;
    isAuthz = allowedRoles.includes(roleLvl as string);
  }

  useEffect(() => {
    if (isLoading) return;

    if (!isAuth) {
      showToast("Vui lòng đăng nhập để tiếp tục!", "error");
      setShouldRedirectLogin(true);
      return;
    }

    if (!isAuthz) {
      showToast("Bạn không có quyền truy cập trang này!", "error");
      setShouldRedirectHome(true);
      return;
    }
  }, [isAuth, isAuthz, showToast, isLoading]);

  if (shouldRedirectLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (shouldRedirectHome) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-900 text-white">
        Đang tải thông tin...
      </div>
    );
  }

  // Prevent flashing unauthorized content
  if (!isAuth || !isAuthz) {
    return null;
  }

  return <>{children}</>;
}
