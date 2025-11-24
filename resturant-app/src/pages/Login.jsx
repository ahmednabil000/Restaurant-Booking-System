import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Check for authentication callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      // Redirect to error page with the error message
      navigate(
        `/login/error?code=auth_error&message=${encodeURIComponent(error)}`
      );
    } else if (token) {
      // If we have a token, redirect to success (the server should handle the user data)
      navigate("/login/success");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const authUrl = `${baseUrl.replace(/\/$/, "")}/auth/google`;

      // Redirect to backend auth endpoint (full page redirect)
      window.location.href = authUrl;
    } catch (err) {
      console.error("Login error:", err);
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#e26136] hover:text-[#cd4f25] transition-colors duration-200 text-sm font-medium"
          >
            <AiOutlineHome className="text-lg" />
            العودة للرئيسية
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-100">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-[#e26136] to-[#cd4f25] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <AiOutlineUser className="text-3xl text-white" />
              </div>
            </div>

            {/* Restaurant Name */}
            <h1 className="text-2xl font-bold text-[#e26136] font-arabic-serif mb-2">
              مطعم راقى
            </h1>

            {/* Welcome Message */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              أهلاً وسهلاً بك
            </h2>
            <p className="text-gray-600 text-sm">
              سجل دخولك للاستمتاع بتجربة مميزة
            </p>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}
          {/* Google Login Button */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700 mb-4 font-medium">
                تسجيل الدخول باستخدام
              </p>

              {loading ? (
                <Button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 hover:bg-gray-100 border border-gray-200 py-3 h-auto"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    جاري تسجيل الدخول...
                  </div>
                </Button>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full cursor-pointer bg-white border-2 border-gray-200 hover:border-[#e26136] hover:bg-orange-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <FcGoogle className="text-xl" />
                  <span className="group-hover:text-[#e26136] transition-colors duration-200">
                    تسجيل الدخول بحساب جوجل
                  </span>
                </button>
              )}
            </div>
          </div>{" "}
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              بتسجيل دخولك، فإنك توافق على
              <Link
                to="/terms"
                className="text-[#e26136] hover:text-[#cd4f25] underline mx-1"
              >
                شروط الخدمة
              </Link>
              و
              <Link
                to="/privacy"
                className="text-[#e26136] hover:text-[#cd4f25] underline mx-1"
              >
                سياسة الخصوصية
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            لا تملك حساب؟
            <span className="text-[#e26136] font-medium mr-1">
              سيتم إنشاء حساب جديد تلقائياً عند تسجيل الدخول
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
