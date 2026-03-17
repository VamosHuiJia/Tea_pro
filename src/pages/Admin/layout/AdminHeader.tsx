import { Bell, Menu, Search } from "lucide-react";

type AdminHeaderProps = {
    onOpenMobileMenu: () => void;
};

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-p-100 bg-white/90 backdrop-blur-md">
            <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenMobileMenu}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-p-100 bg-white text-n-700 shadow-sm lg:hidden"
                        aria-label="Mở menu quản trị"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div>
                        <p className="text-sm text-n-500">Xin chào, Admin</p>
                        <h2 className="text-xl font-bold text-n-800">Bảng điều khiển</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-72 rounded-full border border-p-100 bg-p-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
                        />
                    </div>

                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-p-100 bg-white text-n-700">
                        <Bell className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 rounded-full border border-p-100 bg-white px-3 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-p-700 text-sm font-bold text-white">
                            A
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-n-800">Admin Tea</p>
                            <p className="text-xs text-n-500">Quản trị viên</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}