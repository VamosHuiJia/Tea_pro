type NavbarOptions = {
  navbarSelector?: string;
  onHiddenChange?: (isHidden: boolean) => void;
};

export function initNavbarScrollBehavior(options: NavbarOptions = {}) {
  const { navbarSelector = ".navbar", onHiddenChange } = options;

  const navbar = document.querySelector(navbarSelector) as HTMLElement | null;
  if (!navbar) return () => {};

  let lastScrollY = window.scrollY;
  const navbarHeight = navbar.offsetHeight || 80;

  const onScroll = () => {
    const currentY = window.scrollY;

    if (currentY <= 0) {
      navbar.classList.remove("stick", "visible", "hidden");
      onHiddenChange?.(false);
      lastScrollY = currentY;
      return;
    }

    navbar.classList.add("stick");

    const scrollingDown = currentY > lastScrollY;

    if (scrollingDown && currentY > navbarHeight) {
      navbar.classList.add("hidden");
      navbar.classList.remove("visible");
      onHiddenChange?.(true);
    } else {
      navbar.classList.add("visible");
      navbar.classList.remove("hidden");
      onHiddenChange?.(false);
    }

    lastScrollY = currentY;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}