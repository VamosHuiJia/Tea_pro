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
  const [user, setUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

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
  useOnClickOutside(userDropdownRef, () => setIsUserDropdownOpen(false));

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
    setIsUserDropdownOpen(false);
  };

  const handleUserClick = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    
    if (user) {
      setIsUserDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search:", searchValue);
  };

  return {
    user,
    isMobileMenuOpen,
    isNavbarHidden,
    isDesktopSearchOpen,
    setIsDesktopSearchOpen,
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    isUserDropdownOpen,
    setIsUserDropdownOpen,
    searchValue,
    setSearchValue,
    desktopSearchRef,
    mobileSearchRef,
    userDropdownRef,
    toggleMobileMenu,
    handleLinkClick,
    handleUserClick,
    handleLogout,
    handleSearchSubmit,
  };
}
