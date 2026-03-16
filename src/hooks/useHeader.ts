import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initNavbarScrollBehavior } from "../animations/HideShowNavbar";
import { useOnClickOutside } from "./useOnClickOutside";

export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = initNavbarScrollBehavior({
      navbarSelector: ".navbar",
    });
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = initNavbarScrollBehavior({
      navbarSelector: ".navbar",
      onHiddenChange: (isHidden: boolean) => {
        setIsNavbarHidden(isHidden);
        if (isHidden && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          setIsMobileSearchOpen(false);
        }
      },
    });
    return cleanup;
  }, [isMobileMenuOpen]);

  useOnClickOutside(desktopSearchRef, () => setIsDesktopSearchOpen(false));
  useOnClickOutside(mobileSearchRef, () => setIsMobileSearchOpen(false));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsMobileSearchOpen(false);
      }
      return next;
    });
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleUserClick = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search:", searchValue);
  };

  return {
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
  };
}
