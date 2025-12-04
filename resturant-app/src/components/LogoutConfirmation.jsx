import React, { useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";

const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  // Disable scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineLogout className="text-3xl text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            تأكيد تسجيل الخروج
          </h2>
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 cursor-pointer text-white hover:bg-red-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
