import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initNavbarScrollBehavior } from "../animations/HideShowNavbar";
import { useOnClickOutside } from "./useOnClickOutside";

type RoleLevel = "admin" | "staff" | "user" | string;

type CurrentUser = {
  id?: number | string;
  username?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  roleLevel?: RoleLevel;
};

export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  const syncUserFromStorage = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(userStr));
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      setUser(null);
    }
  };

  useEffect(() => {
    syncUserFromStorage();

    const handleAuthChanged = () => {
      syncUserFromStorage();
    };

    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
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

  const isManager =
    user?.roleLevel === "admin" || user?.roleLevel === "staff";

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
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);

    if (!user) {
      navigate("/login");
      return;
    }

    if (isManager) {
      setIsUserDropdownOpen((prev) => !prev);
      return;
    }

    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    navigate("/profile");
  };

  const handleGoProfile = () => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    navigate("/profile");
  };

  const handleGoAdmin = () => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    navigate("/admin");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search:", searchValue);
  };

  return {
    user,
    isManager,
    isMobileMenuOpen,
    isNavbarHidden,
    isDesktopSearchOpen,
    setIsDesktopSearchOpen,
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    isUserDropdownOpen,
    searchValue,
    setSearchValue,
    desktopSearchRef,
    mobileSearchRef,
    userDropdownRef,
    toggleMobileMenu,
    handleLinkClick,
    handleUserClick,
    handleGoProfile,
    handleGoAdmin,
    handleSearchSubmit,
  };
}