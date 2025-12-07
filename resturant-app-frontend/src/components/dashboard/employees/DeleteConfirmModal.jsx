import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
  permanent,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-red-100 rounded-lg">
            <FaExclamationTriangle className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600">
              {permanent ? "حذف نهائي" : "حذف الموظف"}
            </h3>
            <p className="text-sm text-gray-600">
              هذا الإجراء{" "}
              {permanent ? "لا يمكن التراجع عنه" : "يمكن التراجع عنه"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            هل أنت متأكد من حذف الموظف{" "}
            <span className="font-semibold text-gray-900">
              "{employee?.fullName}"
            </span>
            ؟
          </p>

          {permanent ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">
                ⚠️ تحذير: الحذف النهائي يعني إزالة جميع بيانات الموظف نهائياً من
                النظام ولا يمكن استردادها لاحقاً.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                ℹ️ الحذف العادي يعني تعطيل الموظف فقط، ويمكن إعادة تفعيله
                لاحقاً.
              </p>
            </div>
          )}

          {employee && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">الاسم:</span>{" "}
                  {employee.fullName}
                </p>
                <p>
                  <span className="font-medium">الوظيفة:</span> {employee.job}
                </p>
                {employee.email && (
                  <p>
                    <span className="font-medium">البريد:</span>{" "}
                    {employee.email}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              permanent
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري الحذف...
              </>
            ) : permanent ? (
              "حذف نهائي"
            ) : (
              "تعطيل الموظف"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
