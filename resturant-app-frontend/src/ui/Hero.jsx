import React from "react";
import heroImage from "../assets/hero-section.jpg";

const Hero = () => {
  return (
    <>
      <div className="h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[35rem] w-full relative">
        <img
          src={heroImage}
          alt="Hero section"
          className="w-full h-full object-cover"
        />
        <div className="h-full w-full bg-black/40 absolute top-0 z-2"></div>
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-3 px-4 w-full">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight">
            مطعم راقى
          </span>
          <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-center max-w-4xl leading-relaxed px-4">
            تجربة طعام فاخرة لا تُنسى في قلب المدينة.
          </span>
          <button className="text-white cursor-pointer text-center bg-[#e26136] px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-7 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 mt-2 sm:mt-3">
            احجز طاولتك
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;
