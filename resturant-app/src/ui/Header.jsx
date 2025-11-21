import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [selected, setSelected] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#home", label: "الرئيسة", key: "home" },
    { href: "#about", label: "من نحن", key: "about" },
    { href: "#menu", label: "القائمة", key: "menu" },
    { href: "#shop", label: "المعرض", key: "shop" },
    { href: "#contact-us", label: "تواصل معنا", key: "contact-us" },
  ];

  return (
    <header className="relative w-full bg-white z-20">
      {/* Desktop Header */}
      <div className="flex justify-between items-center h-20 sm:h-24 md:h-28 lg:h-32 px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <div className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[3.1rem] text-[#e26136] font-arabic-serif order-3 lg:order-1">
          مطعم راقى
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 xl:gap-10 text-lg xl:text-[2rem] order-2">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`${
                selected === link.key ? "text-[#e26136]" : ""
              } hover:font-medium hover:text-[#e26136] transition-colors duration-200`}
              onClick={() => setSelected(link.key)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="order-1 lg:order-3">
          <button className="text-white cursor-pointer bg-[#e26136] px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 text-sm sm:text-base md:text-xl lg:text-3xl rounded-lg hover:bg-[#cd4f25] transition-colors duration-200">
            احجز طاولة
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden order-2 p-2 text-2xl text-gray-700 hover:text-[#e26136] transition-colors duration-200"
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
              <a
                key={link.key}
                href={link.href}
                className={`${
                  selected === link.key
                    ? "text-[#e26136] bg-orange-50"
                    : "text-gray-700"
                } px-4 sm:px-6 py-4 text-lg hover:bg-orange-50 hover:text-[#e26136] transition-colors duration-200 border-b border-gray-100 last:border-b-0`}
                onClick={() => {
                  setSelected(link.key);
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
