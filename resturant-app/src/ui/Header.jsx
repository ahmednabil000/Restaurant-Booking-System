import React, { useState, useEffect, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink, Link, useNavigate } from "react-router";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import useAuthStore from "../store/authStore";
import { getUserDisplayName } from "../utils/auth";
import LogoutConfirmation from "../components/LogoutConfirmation";
import CartIcon from "../components/CartIcon";

const Header = () => {
  const [selected, setSelected] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسة", key: "home" },
    { href: "about-us", label: "من نحن", key: "about" },
    { href: "menu", label: "القائمة", key: "menu" },

    { href: "contact-us", label: "تواصل معنا", key: "contact-us" },
  ];

  return (
    <>
      <div className="h-16 sm:h-18 md:h-20 lg:h-22 px-4 sm:px-6 md:px-8 lg:px-10 bg-white"></div>
      <header className=" w-full fixed top-0 bg-white z-20">
        {/* Desktop Header */}
        <div className="flex justify-between relative  items-center h-16 sm:h-18 md:h-20 lg:h-22 px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Logo */}
          <div className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-[#e26136] font-arabic-serif order-3 lg:order-1">
            مطعم راقى
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4 md:gap-6 lg:gap-8 text-sm md:text-base lg:text-lg order-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.href}
                className={`${
                  selected === link.key ? "text-[#ff6900] " : ""
                } hover:font-medium hover:text-[#ff6900] transition-colors duration-50`}
                onClick={() => setSelected(link.key)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button and User Profile/Login */}
          <div className="order-1 lg:order-3 flex items-center gap-2 md:gap-3">
            {/* Cart Icon - Only shows if authenticated */}
            <CartIcon />

            {isAuthenticated && user ? (
              /* User Profile Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center cursor-pointer gap-2 bg-white text-[#e26136] hover:bg-[#e26136] hover:text-white border-2 border-[#e26136] font-semibold text-sm md:text-base lg:text-lg px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={getUserDisplayName(user)}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <AiOutlineUser className="text-lg" />
                  )}
                  <span className="hidden sm:block">{user.fullName}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 sm:left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full cursor-pointer text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <AiOutlineLogout className="text-lg" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                to="/login"
                className="bg-white text-[#e26136] hover:bg-[#e26136] hover:text-white border-2 border-[#e26136] font-semibold text-sm md:text-base lg:text-lg px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                دخول
              </Link>
            )}

            <Link
              to={"/reserve"}
              className="text-white cursor-pointer bg-[#e26136] px-3 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-2.5 text-sm sm:text-base md:text-lg rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              احجز طاولة
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden order-2 p-2 text-xl text-gray-700 hover:text-[#e26136] transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.href}
                  className={`${
                    selected === link.key
                      ? "text-[#ff6900] bg-orange-50 border-l-4 border-[#e26136]"
                      : "text-gray-700"
                  } px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg hover:bg-orange-50 hover:text-[#ff6900] transition-colors duration-200 border-b border-gray-100`}
                  onClick={() => {
                    setSelected(link.key);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
              {/* User Profile or Login Link in Mobile Menu */}
              {isAuthenticated && user ? (
                <div className="border-b border-gray-100">
                  <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-50">
                    <div className="flex items-center gap-3">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={getUserDisplayName(user)}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <AiOutlineUser className="text-xl text-[#e26136]" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-right px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <AiOutlineLogout className="text-lg" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[#e26136] font-semibold bg-orange-50 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg hover:bg-[#e26136] hover:text-white transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Logout Confirmation Popup */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default Header;
