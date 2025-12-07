import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL - your backend should redirect here with these params
        const success = searchParams.get("success");
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");
        const message = searchParams.get("message");

        if (success === "true" && token && userParam) {
          try {
            // Parse user data from URL parameter
            const user = JSON.parse(decodeURIComponent(userParam));

            // Send success data to parent window (popup opener)
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: "GOOGLE_AUTH_SUCCESS",
                  success: true,
                  token: token,
                  user: user,
                  message: message || "Authentication successful",
                },
                "https://restaurant-booking-system-3.onrender.com"
              );

              // Close this popup window
              window.close();
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: "GOOGLE_AUTH_ERROR",
                  message: "خطأ في معالجة بيانات المستخدم",
                },
                window.location.origin
              );
              window.close();
            }
          }
        } else {
          // Authentication failed
          const errorMessage = error || message || "فشل في تسجيل الدخول";
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "GOOGLE_AUTH_ERROR",
                message: errorMessage,
              },
              window.location.origin
            );
            window.close();
          }
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              message: "حدث خطأ أثناء معالجة المصادقة",
            },
            window.location.origin
          );
          window.close();
        }
      }
    };

    // Run callback handler when component mounts
    handleCallback();

    // Also try to close window if it was opened as popup and no opener
    if (!window.opener) {
      console.log("No opener found, this may not be a popup window");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-100 text-center">
          <h1 className="text-2xl font-bold text-[#e26136] font-arabic-serif mb-4">
            مطعم راقى
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            جاري المعالجة...
          </h2>
          <p className="text-gray-600 text-sm">يتم الآن إغلاق النافذة</p>

          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#e26136] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#e26136] rounded-full animate-pulse ml-1"></div>
              <div className="w-2 h-2 bg-[#e26136] rounded-full animate-pulse ml-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
