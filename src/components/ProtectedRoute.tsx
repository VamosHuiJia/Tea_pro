import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { showToast } = useToast();
  const location = useLocation();

  const [shouldRedirectLogin, setShouldRedirectLogin] = useState(false);
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false);

  // Parse user once for synchronous render check
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // ignore
    }
  }

  const isAuth = !!(token && user);
  let isAuthz = true;
  if (isAuth && allowedRoles && allowedRoles.length > 0) {
    const roleLvl = user?.roleLevel || user?.role?.level;
    isAuthz = allowedRoles.includes(roleLvl);
  }

  useEffect(() => {
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
  }, [isAuth, isAuthz, showToast]);

  if (shouldRedirectLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (shouldRedirectHome) {
    return <Navigate to="/" replace />;
  }

  // Prevent flashing unauthorized content
  if (!isAuth || !isAuthz) {
    return null;
  }

  return <>{children}</>;
}
