import React from "react";
import { handleLogout } from "../utils/auth";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

const UserProfile = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const result = await handleLogout();
      if (result.success) {
        logout(); // Clear from Zustand store
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">يرجى تسجيل الدخول</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">معلومات الحساب</h2>

      {/* User Avatar */}
      {user.picture && (
        <div className="text-center mb-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto border-2 border-[#e26136]"
          />
        </div>
      )}

      {/* User Information */}
      <div className="space-y-4">
        {user.name && (
          <div className="border-b pb-2">
            <label className="block text-sm font-medium text-gray-600">
              الاسم
            </label>
            <p className="text-lg text-gray-800">{user.name}</p>
          </div>
        )}

        {user.email && (
          <div className="border-b pb-2">
            <label className="block text-sm font-medium text-gray-600">
              البريد الإلكتروني
            </label>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>
        )}

        {user.id && (
          <div className="border-b pb-2">
            <label className="block text-sm font-medium text-gray-600">
              معرف المستخدم
            </label>
            <p className="text-sm text-gray-600">{user.id}</p>
          </div>
        )}

        {user.provider && (
          <div className="border-b pb-2">
            <label className="block text-sm font-medium text-gray-600">
              طريقة تسجيل الدخول
            </label>
            <p className="text-sm text-gray-600 capitalize">{user.provider}</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogoutClick}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
