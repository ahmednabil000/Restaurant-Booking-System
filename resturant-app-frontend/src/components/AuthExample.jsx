import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useCartQuery } from "../hooks/useCart";
import { showErrorNotification } from "../utils/notifications";

/**
 * Example component demonstrating authentication usage
 * This shows how to use the useAuth hook for conditional rendering
 */
const AuthExample = () => {
  const {
    isAuthenticated,
    user,
    isAdmin,
    role,
    hasRole,
    canAccessAdmin,
    canAccess,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const { data: cartResponse } = useCartQuery();

  // Extract cart data
  const cartData = cartResponse?.success ? cartResponse.cart : null;
  const cartItems = cartData?.items || [];
  const isCartEmpty = cartItems.length === 0;

  const handleReservationClick = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isCartEmpty) {
      showErrorNotification("يجب إضافة وجبات للسلة أولاً لتتمكن من حجز طاولة");
      return;
    }

    navigate("/reserve");
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">غير مسجل الدخول</h2>
        <p className="mb-4">يرجى تسجيل الدخول للوصول للميزات</p>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          مرحباً، {user?.name || user?.email}
        </h2>
        <p className="text-gray-600">الدور: {role || "مستخدم عادي"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Admin only features */}
        {canAccessAdmin() && (
          <div className="p-4 bg-red-50 rounded border border-red-200">
            <h3 className="font-bold text-red-800 mb-2">ميزات الإدارة</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                لوحة التحكم
              </Link>
              <Link
                to="/dashboard/menu-management"
                className="block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                إدارة القوائم
              </Link>
            </div>
          </div>
        )}

        {/* Authenticated user features */}
        {canAccess("cart") && (
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">ميزات المستخدم</h3>
            <div className="space-y-2">
              <Link
                to="/cart"
                className="block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                السلة
              </Link>
              <button
                onClick={handleReservationClick}
                className="block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                حجز طاولة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role-based content */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">المحتوى حسب الدور:</h3>
        {isAdmin && (
          <div className="p-3 bg-purple-100 rounded mb-2">
            <p className="text-purple-800">محتوى خاص بالمديرين فقط</p>
          </div>
        )}
        {hasRole("manager") && (
          <div className="p-3 bg-green-100 rounded mb-2">
            <p className="text-green-800">محتوى خاص بالمشرفين</p>
          </div>
        )}
        {hasRole(["staff", "employee"]) && (
          <div className="p-3 bg-yellow-100 rounded mb-2">
            <p className="text-yellow-800">محتوى خاص بالموظفين</p>
          </div>
        )}
      </div>

      {/* Debug information */}
      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">معلومات التشخيص:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>مسجل الدخول: {isAuthenticated ? "نعم" : "لا"}</p>
          <p>مدير: {isAdmin ? "نعم" : "لا"}</p>
          <p>الدور: {role || "غير محدد"}</p>
          <p>يمكن الوصول للإدارة: {canAccessAdmin() ? "نعم" : "لا"}</p>
          <p>يمكن الوصول للسلة: {canAccess("cart") ? "نعم" : "لا"}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={logout}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AuthExample;
