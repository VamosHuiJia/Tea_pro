import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!mobileOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen bg-[#f7fbf8]">
            <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <div className="flex min-h-screen lg:pl-[280px]">
                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}