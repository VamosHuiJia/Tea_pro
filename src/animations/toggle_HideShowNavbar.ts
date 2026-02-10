// src/animations/header.ts

type HeaderInitOptions = {
    navbarSelector?: string;          
    menuButtonId?: string;            
    mobileMenuId?: string;            
    closeOnLinkClickSelector?: string; 
};

export function initHeaderInteractions(options: HeaderInitOptions = {}) {
    const {
        navbarSelector = ".navbar",
        menuButtonId = "mobileMenuBtn",
        mobileMenuId = "mobileMenu",
        closeOnLinkClickSelector = ".mobileNavLink",
    } = options;

    const navbar = document.querySelector(navbarSelector) as HTMLElement | null;
    const menuBtn = document.getElementById(menuButtonId) as HTMLButtonElement | null;
    const mobileMenu = document.getElementById(mobileMenuId) as HTMLElement | null;

    if (!navbar) {
        console.warn(`[header.ts] Không tìm thấy navbar theo selector: ${navbarSelector}`);
    }
    if (!menuBtn) {
        console.warn(`[header.ts] Không tìm thấy menu button theo id: ${menuButtonId}`);
    }
    if (!mobileMenu) {
        console.warn(`[header.ts] Không tìm thấy mobile menu theo id: ${mobileMenuId}`);
    }

    let isMenuOpen = false;
    let lastScrollY = window.scrollY;
    const offset = navbar?.offsetHeight ?? 0;

    const setMenuOpen = (open: boolean) => {
        isMenuOpen = open;
        if (!mobileMenu || !menuBtn) return;

        // show/hide bằng class "open" đúng như CSS dropdown-menu của bạn
        mobileMenu.classList.toggle("open", isMenuOpen);

        menuBtn.setAttribute("aria-expanded", String(isMenuOpen));
    };

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const onMenuBtnClick = () => toggleMenu();

    const onMobileLinkClick = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Nếu click vào item trong menu mobile -> đóng menu
        if (target.closest(closeOnLinkClickSelector)) {
            setMenuOpen(false);
        }
    };

    const onScroll = () => {
        if (!navbar) return;

        const y = window.scrollY;

        if (y <= 0) {
            navbar.classList.remove("stick", "visible", "hidden");
            lastScrollY = y;
            return;
        }

        navbar.classList.add("stick");

        const goingDown = y > lastScrollY;

        if (goingDown && y > offset) {
            // scroll xuống -> ẩn
            navbar.classList.add("hidden");
            navbar.classList.remove("visible");

            setMenuOpen(false);
        } else {
            // scroll lên -> hiện
            navbar.classList.add("visible");
            navbar.classList.remove("hidden");
        }

        lastScrollY = y;
    };


    menuBtn?.addEventListener("click", onMenuBtnClick);
    mobileMenu?.addEventListener("click", onMobileLinkClick);
    window.addEventListener("scroll", onScroll, { passive: true });


    return () => {
        menuBtn?.removeEventListener("click", onMenuBtnClick);
        mobileMenu?.removeEventListener("click", onMobileLinkClick);
        window.removeEventListener("scroll", onScroll);
    };
}
