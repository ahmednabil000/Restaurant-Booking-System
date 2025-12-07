import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";

const CancelPayment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-6">
            <MdOutlineCancel className="text-red-600 text-6xl sm:text-7xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          تم إلغاء العملية
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-3">
          لم تكتمل عملية الدفع
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-500 mb-6 leading-relaxed">
          يمكنك المحاولة مرة أخرى أو التواصل مع خدمة العملاء للمساعدة
        </p>

        {/* Help Note */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-[#e26136]">
            <BiSupport className="text-2xl" />
            <p className="text-sm sm:text-base font-medium">
              هل تحتاج للمساعدة؟ تواصل معنا عبر صفحة الاتصال
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/cart"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e26136] text-white rounded-lg hover:bg-[#cd4f25] transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base sm:text-lg"
          >
            <AiOutlineShoppingCart className="text-xl" />
            العودة للسلة
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-base sm:text-lg"
          >
            <AiOutlineHome className="text-xl" />
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPayment;
