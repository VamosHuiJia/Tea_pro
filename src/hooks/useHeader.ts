import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initNavbarScrollBehavior } from "../animations/HideShowNavbar";
import { useOnClickOutside } from "./useOnClickOutside";
import { useAuth } from "../contexts/AuthContext";



export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user } = useAuth();
  
  const navigate = useNavigate();
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileUserDropdownRef = useRef<HTMLDivElement | null>(null);

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
  useOnClickOutside([userDropdownRef, mobileUserDropdownRef], () => setIsUserDropdownOpen(false));

  const roleLvl = user?.roleLevel || user?.role?.level;
  const isManager = roleLvl === "admin" || roleLvl === "staff";

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
    mobileUserDropdownRef,
    toggleMobileMenu,
    handleLinkClick,
    handleUserClick,
    handleGoProfile,
    handleGoAdmin,
    handleSearchSubmit,
  };
}