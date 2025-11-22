import React from "react";
import heroImage from "../assets/hero-section.jpg";

const Hero = () => {
  return (
    <>
      <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[53.8rem] w-full relative">
        <img
          src={heroImage}
          alt="Hero section"
          className="w-full h-full object-cover"
        />
        <div className="h-full w-full bg-black/40 absolute top-0 z-2"></div>
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-3 px-4 w-full">
          <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[6rem] font-bold text-center leading-tight">
            مطعم راقى
          </span>
          <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[2.4rem] font-medium text-center max-w-4xl leading-relaxed px-4">
            تجربة طعام فاخرة لا تُنسى في قلب المدينة.
          </span>
          <button className="text-white cursor-pointer text-center bg-[#e26136] px-4 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5 lg:px-8 lg:py-7 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 mt-2 sm:mt-4">
            احجز طاولتك
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;
