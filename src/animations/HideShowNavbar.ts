// src/animations/HideShowNavbar.ts

type NavbarOptions = {
  navbarSelector?: string;
};

export function initNavbarScrollBehavior(options: NavbarOptions = {}) {
  const { navbarSelector = ".navbar" } = options;

  const navbar = document.querySelector(navbarSelector) as HTMLElement | null;
  if (!navbar) {
    return () => {};
  }

  let lastScrollY = window.scrollY;
  const navbarHeight = navbar.offsetHeight || 80;

  const onScroll = () => {
    const currentY = window.scrollY;

    if (currentY <= 0) {
      navbar.classList.remove("stick", "visible", "hidden");
      lastScrollY = currentY;
      return;
    }

    navbar.classList.add("stick");

    const scrollingDown = currentY > lastScrollY;

    if (scrollingDown && currentY > navbarHeight) {
      navbar.classList.add("hidden");
      navbar.classList.remove("visible");
    } 
    else {
      navbar.classList.add("visible");
      navbar.classList.remove("hidden");
    }

    lastScrollY = currentY;
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // cleanup
  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}