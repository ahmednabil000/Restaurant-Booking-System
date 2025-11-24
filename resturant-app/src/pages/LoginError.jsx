import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  AiOutlineCloseCircle,
  AiOutlineHome,
  AiOutlineReload,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const LoginError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get error message from URL params or use default
  const errorMessage =
    searchParams.get("message") || "حدث خطأ أثناء تسجيل الدخول";
  const errorCode = searchParams.get("code") || "";

  // Auto redirect to login after 10 seconds if user doesn't act
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getErrorMessage = () => {
    switch (errorCode) {
      case "popup_closed":
        return "تم إغلاق نافذة تسجيل الدخول";
      case "access_denied":
        return "تم رفض الوصول لحسابك";
      case "popup_blocked":
        return "تم حظر نافذة تسجيل الدخول";
      case "network_error":
        return "خطأ في الاتصال بالإنترنت";
      default:
        return errorMessage;
    }
  };

  const getErrorDescription = () => {
    switch (errorCode) {
      case "popup_closed":
        return "قمت بإغلاق نافذة تسجيل الدخول قبل إتمام العملية";
      case "access_denied":
        return "لم تمنح الصلاحية للوصول إلى بيانات حسابك";
      case "popup_blocked":
        return "يرجى السماح للنوافذ المنبثقة في متصفحك";
      case "network_error":
        return "تأكد من اتصالك بالإنترنت وحاول مرة أخرى";
      default:
        return "حاول تسجيل الدخول مرة أخرى أو تواصل معنا إذا استمرت المشكلة";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-red-100 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AiOutlineCloseCircle className="text-4xl text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#e26136] font-arabic-serif mb-4">
            مطعم راقى
          </h1>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">عذراً!</h2>
          <p className="text-gray-600 mb-2 font-medium">{getErrorMessage()}</p>
          <p className="text-sm text-gray-500 mb-6">{getErrorDescription()}</p>

          {errorCode && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <AiOutlineCloseCircle className="text-lg" />
                <span className="text-sm font-medium">تفاصيل الخطأ</span>
              </div>
              <p className="text-xs text-red-700 font-mono bg-red-100 px-2 py-1 rounded">
                خطأ: {errorCode}
              </p>
            </div>
          )}

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-right">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              نصائح لحل المشكلة:
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• تأكد من اتصالك بالإنترنت</li>
              <li>• امسح ذاكرة التخزين المؤقت للمتصفح</li>
              <li>• تأكد من تفعيل النوافذ المنبثقة</li>
              <li>• جرب استخدام متصفح آخر</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-[#e26136] text-white hover:bg-[#cd4f25] font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <AiOutlineReload className="text-lg" />
              المحاولة مرة أخرى
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-[#e26136] border-2 border-[#e26136] hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <FcGoogle className="text-lg" />
              إعادة تحميل الصفحة
            </button>

            <Link
              to="/"
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <AiOutlineHome className="text-lg" />
              العودة للصفحة الرئيسية
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">
              هل تحتاج مساعدة؟ تواصل معنا
            </p>
            <Link
              to="/contact-us"
              className="text-xs text-[#e26136] hover:text-[#cd4f25] underline"
            >
              صفحة التواصل
            </Link>
          </div>

          <div className="mt-4 p-2 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-xs text-yellow-700">
              سيتم توجيهك لصفحة تسجيل الدخول خلال 10 ثوانٍ تلقائياً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginError;
