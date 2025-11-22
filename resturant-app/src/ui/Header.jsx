import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink, Link } from "react-router";

const Header = () => {
  const [selected, setSelected] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "/", label: "الرئيسة", key: "home" },
    { href: "about-us", label: "من نحن", key: "about" },
    { href: "menu", label: "القائمة", key: "menu" },

    { href: "contact-us", label: "تواصل معنا", key: "contact-us" },
  ];

  return (
    <header className="relative w-full bg-white z-20">
      {/* Desktop Header */}
      <div className="flex justify-between items-center h-20 sm:h-24 md:h-28 lg:h-32 px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <div className="font-semibold text-lg sm:text-xl md:text-3xl lg:text-4xl text-[#e26136] font-arabic-serif order-3 lg:order-1">
          مطعم راقى
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 md:gap-8 lg:gap-10 text-base md:text-xl lg:text-2xl order-2">
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

        {/* CTA Button and Login */}
        <div className="order-1 lg:order-3 flex items-center gap-3 md:gap-4">
          <Link
            to="/login"
            className="bg-white text-[#e26136] hover:bg-[#e26136] hover:text-white border-2 border-[#e26136] font-semibold text-base md:text-lg lg:text-xl px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            دخول
          </Link>
          <Link
            to={"/reserve"}
            className="text-white cursor-pointer bg-[#e26136] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3 text-base sm:text-lg md:text-xl lg:text-2xl rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            احجز طاولة
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden order-2 p-2 text-2xl text-gray-700 hover:text-[#e26136] transition-colors duration-200"
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
                } px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg md:text-xl hover:bg-orange-50 hover:text-[#ff6900] transition-colors duration-200 border-b border-gray-100`}
                onClick={() => {
                  setSelected(link.key);
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
              </NavLink>
            ))}
            {/* Login Link in Mobile Menu */}
            <Link
              to="/login"
              className="text-[#e26136] font-semibold bg-orange-50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg md:text-xl hover:bg-[#e26136] hover:text-white transition-all duration-200 border-b border-gray-100 last:border-b-0"
              onClick={() => setIsMenuOpen(false)}
            >
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
