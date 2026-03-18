import {
  ArrowLeft,
  BadgePercent,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const menus = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { to: "/admin/categories", label: "Danh mục", icon: Tags },
  { to: "/admin/brands", label: "Thương hiệu", icon: BadgePercent },
  { to: "/admin/employees", label: "Nhân viên", icon: UserRound },
  { to: "/admin/customers", label: "Khách hàng", icon: Users },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col px-5 py-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg capitalize font-lobster text-p-400">Huy bán Trà</p>
          <h2 className="mt-1 text-2xl font-bold">Trang quản lý</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white lg:hidden"
          aria-label="Đóng menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive
                  ? "bg-p-700 text-white shadow-lg"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <div className="rounded-[24px] bg-white/10 p-4">
          <p className="text-sm text-white/70">Hệ thống quản trị</p>
          <p className="mt-2 text-lg font-semibold">Cửa hàng
            <span className="text-lg capitalize font-lobster text-p-400"> Huy bán Trà</span>
          </p>
          <p className="mt-2 text-xs leading-6 text-white/60">
            Từng cử chỉ nhỏ bé, từng lời chào hỏi nhẹ nhàng, từng tách trà được pha cẩn thận – tất cả tạo nên trải nghiệm đáng nhớ.
          </p>
        </div>

        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
        >
          <ArrowLeft className="h-5 w-5" />
          Trở về trang chủ
        </NavLink>
      </div>
    </div>
  );
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-y-auto bg-p-950 text-white shadow-2xl lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-50 bg-n-800/50 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${mobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[280px] max-w-[85vw] overflow-y-auto bg-p-950 text-white shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}