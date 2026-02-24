// src/components/layout/header.tsx
import { useEffect, useState } from "react";
import { initNavbarScrollBehavior } from "../../animations/HideShowNavbar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Chỉ chạy logic ẩn/hiện navbar khi scroll
  useEffect(() => {
    const cleanup = initNavbarScrollBehavior({
      navbarSelector: ".navbar",
    });
    return cleanup;
  }, []);

  // Toggle menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Đóng menu khi click link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50">
      <div className="navbar">
        <div className="max-w-[1536px] w-full px-4 py-4 md:px-[72px] mx-auto flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center flex-none gap-3">
            <img
              src="../../images/logo.png"
              alt="logo"
              className="w-16 h-16"
            />
            <p className="text-lg capitalize font-lobster text-p-900">
              Huy bán Trà
            </p>
          </a>

          {/* Desktop Nav */}
          <nav className="items-center hidden gap-8 lg:flex">
            <a href="/" className="navLink">Trang chủ</a>
            <a href="#products" className="navLink">Sản Phẩm</a>
            <a href="#story" className="navLink">Giới Thiệu</a>
            <a href="#contact" className="navLink">Liên Hệ</a>
          </nav>

          {/* Hamburger button - mobile */}
          <button
            id="mobileMenuBtn"
            className="p-2 cursor-pointer lg:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <img
              src="../../images/Menu Icon.svg"
              alt="menu"
              className="w-6 h-6"
            />
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobileMenu"
        className={`
          lg:hidden fixed inset-x-0 top-[80px] bg-white/95 backdrop-blur-md
          shadow-lg transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        <div className="max-w-[1536px] mx-auto px-6 py-8 flex flex-col gap-6 text-center">
          <a href="/" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Trang chủ
          </a>
          <a href="#products" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Sản Phẩm
          </a>
          <a href="#story" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Giới Thiệu
          </a>
          <a href="#contact" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Liên Hệ
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;