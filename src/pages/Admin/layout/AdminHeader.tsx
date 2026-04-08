import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

type AdminHeaderProps = {
  onOpenMobileMenu: () => void;
};

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/admin/brands")) return "Quản lý thương hiệu";
    if (pathname.startsWith("/admin/categories")) return "Quản lý danh mục";
    if (pathname.startsWith("/admin/products")) return "Quản lý sản phẩm";
    if (pathname.startsWith("/admin/dashboard")) return "Tổng quan cửa hàng";
    if (pathname.startsWith("/admin/customers")) return "Quản lý khách hàng";
    if (pathname.startsWith("/admin/employees")) return "Quản lý nhân viên";
    if (pathname.startsWith("/admin/orders")) return "Quản lý đơn hàng";
    if (pathname.startsWith("/admin/payments")) return "Quản lý thanh toán";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-p-100 bg-white/90 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3 px-4 py-4 md:items-center md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 shadow-sm lg:hidden"
            aria-label="Mở menu quản trị"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm text-n-500">Xin chào, {user?.username || "Admin"}</p>
            <h2 className="truncate text-lg font-bold text-n-800 sm:text-xl">{pageTitle}</h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-72 rounded-full border border-p-100 bg-p-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
            />
          </div>

          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-p-100 bg-white text-n-700 sm:h-11 sm:w-11">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-p-100 bg-white px-2.5 py-2 sm:gap-3 sm:px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-p-700 text-sm font-bold text-white uppercase sm:h-10 sm:w-10">
              {user?.username ? user.username.charAt(0) : "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-n-800">{user?.username || "Admin"}</p>
              <p className="text-xs text-n-500">{user?.roleName || (user?.role?.level === "admin" ? "Quản trị viên" : "Nhân viên")}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
