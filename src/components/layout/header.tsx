// src/components/layout/header.tsx
import { useEffect } from "react";
import { initHeaderInteractions } from "../../animations/toggle_HideShowNavbar";

const Header = () => {
    useEffect(() => {
        const cleanup = initHeaderInteractions({
            navbarSelector: ".navbar",
            menuButtonId: "mobileMenuBtn",
            mobileMenuId: "mobileMenu",
            closeOnLinkClickSelector: ".mobileNavLink",
        });
        return cleanup;
    }, []);

    return (
        <header className="relative z-50">
            <div className="flex items-center justify-center navbar">
                <div className="max-w-[1536px] w-full px-4 py-4 md:px-[72px] flex items-center justify-between">

                    {/* Logo */}
                    <a href="/" className="flex items-center justify-center flex-none">
                        <img
                            src="../../images/logo.png"
                            alt="logo"
                            className="w-16 h-16"
                        />
                        <p className="text-lg capitalize font-lobster text-p-900">
                            Huy bán Trà
                        </p>
                    </a>

                    {/* Desktop navigation */}
                    <nav className="items-center justify-end hidden w-full gap-4 lg:flex lg:gap-8">
                        <a href="/" className="navLink">Trang chủ</a>
                        <a href="#products" className="navLink">Sản Phẩm</a>
                        <a href="#story" className="navLink">Giới Thiệu</a>
                        <a href="#contact" className="navLink">Liên Hệ</a>
                    </nav>

                    {/* Hamburger icon (mobile) */}
                    <div className="block cursor-pointer lg:hidden">
                        <img
                            src="../../images/Menu Icon.svg"
                            alt="menu_icon"
                            className="size-5"
                        />
                    </div>

                    {/* Mobile menu (chưa xử lý logic toggle) */}
                    <div className="dropdown-menu lg:hidden">
                        <a href="/" className="navLink mobileNavLink">
                            Trang chủ
                        </a>
                        <a href="#products" className="navLink mobileNavLink">
                            Sản phẩm
                        </a>
                        <a href="#story" className="navLink mobileNavLink">
                            Giới thiệu
                        </a>
                        <a href="#contact" className="navLink mobileNavLink">
                            Liên hệ
                        </a>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
