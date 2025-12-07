import React from "react";
import { Link } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";

const SuccessPayment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <BsCheckCircleFill className="text-green-600 text-6xl sm:text-7xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          تمت العملية بنجاح
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-3">
          شكراً لك على الدفع
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-500 mb-8 leading-relaxed">
          تم استلام طلبك وسيتم معالجته قريباً. ستصلك رسالة تأكيد عبر البريد
          الإلكتروني
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e26136] text-white rounded-lg hover:bg-[#cd4f25] transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base sm:text-lg"
          >
            <AiOutlineHome className="text-xl" />
            العودة للرئيسية
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#e26136] border-2 border-[#e26136] rounded-lg hover:bg-[#e26136] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-base sm:text-lg"
          >
            <AiOutlineShoppingCart className="text-xl" />
            تصفح القائمة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
