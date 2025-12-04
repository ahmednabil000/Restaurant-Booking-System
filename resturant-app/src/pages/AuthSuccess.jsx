import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus } from "../utils/auth";
import useAuthStore from "../store/authStore";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("جاري تسجيل الدخول...");
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        setStatus("جاري التحقق من الهوية...");

        // Wait a moment for the authentication to complete
        setTimeout(async () => {
          console.log("Starting authentication check...");

          // First check if authentication was successful
          setStatus("جاري جلب بيانات المستخدم...");
          const authResult = await checkAuthStatus();

          if (authResult.success && authResult.user) {
            console.log("User data received:", authResult.user);

            // Store user data in Zustand store
            login(authResult.user);

            // Verify data is saved in localStorage
            const savedUser = localStorage.getItem("user");
            console.log("Data saved to localStorage:", savedUser);

            setStatus("تم تسجيل الدخول بنجاح! جاري التوجيه...");

            // Clear auth type from session storage
            sessionStorage.removeItem("authType");

            // Show success message briefly then redirect to home page
            setLoading(false);
            setTimeout(() => {
              console.log("Redirecting to home page...");
              navigate("/"); // Redirect to home page
            }, 1500);
          } else {
            console.error("Authentication failed:", authResult.error);
            setError("فشل في تسجيل الدخول. حاول مرة أخرى.");
            setLoading(false);

            // Redirect to login after showing error
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          }
        }, 1000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setError("حدث خطأ أثناء تسجيل الدخول.");
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            جاري تسجيل الدخول...
          </h2>
          <p className="text-muted-foreground">
            {status || "الرجاء الانتظار بينما نقوم بتسجيل دخولك"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            فشل تسجيل الدخول
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            سيتم إعادة توجيهك إلى صفحة تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          تم تسجيل الدخول بنجاح!
        </h2>
        <p className="text-muted-foreground">
          مرحباً بك، سيتم إعادة توجيهك الآن...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
