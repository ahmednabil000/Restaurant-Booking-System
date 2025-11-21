import { FaPhoneAlt } from "react-icons/fa";
import Container from "./Container";
import React from "react";
import { IoMdMail } from "react-icons/io";

function Footer() {
  return (
    <footer className="py-16 ">
      <Container>
        <div className="grid grid-cols-3 w-full pb-8">
          <div className="flex flex-col gap-3 items-center sm:text-[1rem]md:text-[1.3rem] lg:text-[1.6rem] ">
            <p className="font-bold sm:text-[1.2rem] md:text-[1.5rem] lg:text-[1.8rem] cursor-pointer">
              تواصل معنا
            </p>
            <button className="flex gap-4 justify-center items-center ">
              <p className="">{"112220000 20+ "}</p>
              <FaPhoneAlt />
            </button>
            <button className="flex gap-4 justify-center items-center ">
              <p className="">{"company@gmail.com"}</p>
              <IoMdMail />
            </button>
            <p className="">مصر, القاهرة, التجمع الخامس</p>
          </div>
          <div className="flex flex-col gap-3 sm:text-[1rem]md:text-[1.3rem] lg:text-[1.6rem]  items-center">
            <p className="font-bold sm:text-[1.2rem] md:text-[1.5rem] lg:text-[1.8rem] cursor-pointer">
              روابط سريعة
            </p>
            <button className="cursor-pointer">الرئيسية</button>
            <button className="cursor-pointer">من نحن</button>
            <button className="cursor-pointer">القائمة</button>
            <button className="cursor-pointer">المعرض</button>
            <button className="cursor-pointer">تواصل معنا</button>
          </div>
          <div className="text-center sm:text-[1rem]md:text-[1.3rem] lg:text-[1.6rem] ">
            <p className="lg:text-[2.6rem] md:text-[2.3rem] sm:text-[2rem] font-semibold text-[#e26136] mb-4">
              مطعم راقي
            </p>
            <p className="">
              نقدم تجربة طعام فاخرة بأشهى الأطباق وأجود المكونات.
            </p>
          </div>
        </div>
        <div className="h-[5.3rem] flex justify-center items-center text-[1.4rem]  border-t-2 border-gray-400/10">
          مطعم راقي. جميع الحقوق محفوظة. {new Date().getFullYear()}©
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
