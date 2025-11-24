import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AiOutlineCheckCircle, AiOutlineHome } from "react-icons/ai";
import useAuthStore from "../store/authStore";
import { getUserDisplayName } from "../utils/auth";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  // Handle token from URL params and decode JWT
  useEffect(() => {
    const handleTokenAuth = () => {
      const token = searchParams.get("token");

      if (token && !isAuthenticated) {
        try {
          // Store token
          localStorage.setItem("auth_token", token);

          // Decode JWT token to get user data
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          const decodedToken = JSON.parse(jsonPayload);

          // Create user data object from JWT payload
          const userData = {
            id: decodedToken.id,
            email: decodedToken.email,
            fullName: decodedToken.fullName,
            role: decodedToken.role || "customer",
          };

          // Store user data
          login(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setLoading(false);
        } catch (error) {
          console.error("Token decode error:", error);
          localStorage.removeItem("auth_token");
          navigate(
            "/login/error?code=token_error&message=" +
              encodeURIComponent("خطأ في معالجة رمز المصادقة")
          );
        }
      } else if (!token && !isAuthenticated) {
        // No token and not authenticated, redirect to login
        navigate("/login");
      } else {
        // Already authenticated
        setLoading(false);
      }
    };

    handleTokenAuth();
  }, [searchParams, isAuthenticated, login, navigate]);

  // Auto redirect to home after countdown
  useEffect(() => {
    if (!loading && isAuthenticated && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [navigate, loading, isAuthenticated, countdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-linear-to-br from-[#e26136] to-[#cd4f25] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#e26136] font-arabic-serif mb-4">
              مطعم راقى
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              جاري تسجيل الدخول...
            </h2>
            <p className="text-gray-600 text-sm">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AiOutlineCheckCircle className="text-4xl text-white" />
            </div>
          </div>

          {/* Restaurant Name */}
          <h1 className="text-2xl font-bold text-[#e26136] font-arabic-serif mb-4">
            مطعم راقى
          </h1>

          {/* Success Message */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            مرحباً بك!
          </h2>
          <p className="text-gray-600 mb-6">تم تسجيل دخولك بنجاح</p>

          {/* User Info */}
          {user && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center justify-center gap-3 mb-2">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={getUserDisplayName(user)}
                    className="w-12 h-12 rounded-full border-2 border-orange-200"
                  />
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-800">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Details */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <AiOutlineCheckCircle className="text-lg" />
              <span className="text-sm font-medium">تم التحقق من الهوية</span>
            </div>
            <p className="text-xs text-gray-500">
              سيتم توجيهك للصفحة الرئيسية خلال{" "}
              <span className="font-bold text-[#e26136]">{countdown}</span>{" "}
              {countdown === 1 ? "ثانية" : "ثوانٍ"}...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-[#e26136] text-white hover:bg-[#cd4f25] font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <AiOutlineHome className="text-lg" />
              الانتقال للصفحة الرئيسية
            </Link>

            <Link
              to="/menu"
              className="w-full bg-white text-[#e26136] border-2 border-[#e26136] hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              استكشف القائمة
            </Link>
          </div>

          {/* Footer Message */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              نتمنى لك تجربة ممتعة في مطعمنا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
