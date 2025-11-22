import { FaPhoneAlt } from "react-icons/fa";
import Container from "./Container";
import { IoMdMail } from "react-icons/io";

function Footer() {
  return (
    <footer className="py-16 ">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full pb-8 gap-8 md:gap-4">
          <div className="flex flex-col gap-3 items-center text-base sm:text-lg">
            <p className="font-bold text-lg sm:text-xl md:text-2xl cursor-pointer">
              تواصل معنا
            </p>
            <button className="flex gap-2 justify-center items-center">
              <p className="text-base sm:text-lg">{"112220000 20+ "}</p>
              <FaPhoneAlt className="w-4 h-4" />
            </button>
            <button className="flex gap-2 justify-center items-center">
              <p className="text-base sm:text-lg">{"company@gmail.com"}</p>
              <IoMdMail className="w-4 h-4" />
            </button>
            <p className="text-base sm:text-lg">مصر, القاهرة, التجمع الخامس</p>
          </div>
          <div className="flex flex-col gap-3 items-center text-base sm:text-lg">
            <p className="font-bold text-lg sm:text-xl md:text-2xl cursor-pointer">
              روابط سريعة
            </p>
            <button className="cursor-pointer hover:text-orange-500 transition-colors">
              الرئيسية
            </button>
            <button className="cursor-pointer hover:text-orange-500 transition-colors">
              من نحن
            </button>
            <button className="cursor-pointer hover:text-orange-500 transition-colors">
              القائمة
            </button>
            <button className="cursor-pointer hover:text-orange-500 transition-colors">
              المعرض
            </button>
            <button className="cursor-pointer hover:text-orange-500 transition-colors">
              تواصل معنا
            </button>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#e26136] mb-4">
              مطعم راقي
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              نقدم تجربة طعام فاخرة بأشهى الأطباق وأجود المكونات.
            </p>
          </div>
        </div>
        <div className="py-6 flex justify-center items-center text-base sm:text-lg text-gray-600 border-t-2 border-gray-400/10">
          مطعم راقي. جميع الحقوق محفوظة. {new Date().getFullYear()}©
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
