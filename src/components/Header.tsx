import { Link } from "react-router-dom";
import { useHeader } from "../hooks/useHeader";

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="4" />
  </svg>
);

const CartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path
      d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.9a1 1 0 0 0 1-.8L21 7H7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const {
    isMobileMenuOpen,
    isNavbarHidden,
    isDesktopSearchOpen,
    setIsDesktopSearchOpen,
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    searchValue,
    setSearchValue,
    desktopSearchRef,
    mobileSearchRef,
    toggleMobileMenu,
    handleLinkClick,
    handleUserClick,
    handleSearchSubmit,
  } = useHeader();

  return (
    <header className="relative z-50">
      <div className="navbar">
        <div className="max-w-[1536px] w-full px-4 py-4 md:px-[72px] mx-auto relative">
          <div className="grid items-center grid-cols-[auto_1fr_auto] gap-4 lg:gap-8">
            <Link to="/" className="flex items-center flex-none gap-3" onClick={handleLinkClick}>
              <img src="../../images/logo.png" alt="logo" className="w-16 h-16" />
              <p className="text-lg capitalize font-lobster text-p-900">Huy bán Trà</p>
            </Link>

            <nav className="items-center justify-center hidden gap-8 lg:flex">
              <Link to="/" className="navLink">
                Trang chủ
              </Link>
              <Link to="/products" className="navLink">
                Sản phẩm
              </Link>
              <a href="/#story" className="navLink">
                Giới thiệu
              </a>
              <a href="/#contact" className="navLink">
                Liên hệ
              </a>
              <Link to="/admin" className="navLink">
                Admin
              </Link>
            </nav>

            <div className="flex items-center justify-end gap-2 md:gap-3">
              <div className="relative hidden lg:block" ref={desktopSearchRef}>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 transition-colors border-0 rounded-full text-p-900 hover:bg-p-50"
                  onClick={() => setIsDesktopSearchOpen((prev) => !prev)}
                  aria-label="Mở tìm kiếm"
                  aria-expanded={isDesktopSearchOpen}
                >
                  <SearchIcon />
                </button>

                <div
                  className={`absolute right-0 top-full mt-4 w-[460px] rounded-[22px] border border-p-100 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(13,71,56,0.12)] transition-all duration-200 ${
                    isDesktopSearchOpen
                      ? "visible opacity-100 translate-y-0"
                      : "invisible pointer-events-none opacity-0 -translate-y-2"
                  }`}
                >
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="h-12 w-full rounded-2xl border border-n-200 bg-white px-4 text-sm text-p-900 placeholder:text-gray-400 outline-none transition focus:border-n-200 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-12 shrink-0 rounded-2xl bg-p-900 px-5 text-sm font-medium text-white border-0 hover:bg-p-700"
                    >
                      Tìm kiếm
                    </button>
                  </form>
                </div>
              </div>

              <button
                type="button"
                className="items-center justify-center hidden w-10 h-10 transition-colors border-0 rounded-full lg:flex text-p-900 hover:bg-p-50"
                onClick={handleUserClick}
                aria-label="Đăng nhập"
              >
                <UserIcon />
              </button>

              <button
                type="button"
                className="items-center justify-center hidden w-10 h-10 transition-colors border-0 rounded-full lg:flex text-p-900 hover:bg-p-50"
                aria-label="Giỏ hàng"
              >
                <CartIcon />
              </button>

              <button
                id="mobileMenuBtn"
                type="button"
                className="p-2 cursor-pointer lg:hidden"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <img src="../../images/Menu Icon.svg" alt="menu" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="mobileMenu"
        className={`lg:hidden fixed inset-x-0 top-[80px] bg-white/90 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out ${
          isMobileMenuOpen && !isNavbarHidden
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 pointer-events-none invisible"
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-6 py-8 flex flex-col gap-6 text-center">
          <div className="flex items-center justify-center gap-3 pb-2 border-b border-p-100">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 transition-colors border rounded-full border-p-100 text-p-900 hover:bg-p-50"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label="Mở tìm kiếm"
              aria-expanded={isMobileSearchOpen}
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 transition-colors border rounded-full border-p-100 text-p-900 hover:bg-p-50"
              onClick={handleUserClick}
              aria-label="Đăng nhập"
            >
              <UserIcon />
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 transition-colors border rounded-full border-p-100 text-p-900 hover:bg-p-50"
              aria-label="Giỏ hàng"
            >
              <CartIcon />
            </button>
          </div>

          <div
            ref={mobileSearchRef}
            className={`overflow-hidden transition-all duration-300 ${
              isMobileSearchOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-12 w-full rounded-2xl border border-n-200 bg-white px-4 text-sm text-p-900 placeholder:text-gray-400 outline-none focus:border-n-200 focus:outline-none focus:ring-0 focus:shadow-none"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-2xl bg-p-900 px-4 text-sm font-medium text-white border-0 hover:bg-p-700"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          <Link to="/" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Trang chủ
          </Link>
          <Link to="/products" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Sản phẩm
          </Link>
          <a href="/#story" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Giới thiệu
          </a>
          <a href="/#contact" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Liên hệ
          </a>
          <Link to="/admin" className="py-3 text-lg navLink mobileNavLink" onClick={handleLinkClick}>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;