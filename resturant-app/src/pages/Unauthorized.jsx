import { Link } from "react-router-dom";

/**
 * Unauthorized page component shown when user doesn't have required permissions
 */
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            غير مخول للدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-6xl text-gray-400">🚫</div>

          <div className="space-y-2">
            <p className="text-gray-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الإدارة
            </p>
          </div>

          <div className="space-x-4 rtl:space-x-reverse">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              العودة للرئيسية
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
