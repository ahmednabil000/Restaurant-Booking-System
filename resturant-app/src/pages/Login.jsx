import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const handleGoogleLogin = () => {
    // Google authentication logic will be implemented here
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="font-arabic-serif text-5xl md:text-6xl font-bold text-[#e26136] mb-3">
            مطعم راقى
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl">
            أهلاً وسهلاً بك
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              تسجيل الدخول
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              سجل دخولك للوصول إلى حسابك
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            size="lg"
            className="w-full h-14 text-xl font-medium border-2 hover:bg-accent/50 transition-all duration-200 flex items-center justify-center gap-4 hover:shadow-md"
          >
            <FcGoogle className="size-7" />
            <span>تسجيل الدخول بحساب جوجل</span>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">أو</span>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="text-center space-y-4">
            <p className="text-base md:text-lg text-muted-foreground">
              ليس لديك حساب؟
              <span className="text-[#e26136] hover:text-[#cd4f25] cursor-pointer font-medium mr-1">
                إنشاء حساب جديد
              </span>
            </p>

            <p className="text-base md:text-lg text-muted-foreground">
              <span className="text-[#e26136] hover:text-[#cd4f25] cursor-pointer font-medium">
                نسيت كلمة المرور؟
              </span>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-sm md:text-base text-muted-foreground">
            بتسجيل الدخول، أنت توافق على
            <span className="text-[#e26136] hover:text-[#cd4f25] cursor-pointer mr-1">
              شروط الاستخدام
            </span>
            و
            <span className="text-[#e26136] hover:text-[#cd4f25] cursor-pointer mr-1">
              سياسة الخصوصية
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
