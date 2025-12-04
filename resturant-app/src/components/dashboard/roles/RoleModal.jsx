import React, { useState } from "react";
import { FaTimes, FaTag, FaAlignLeft } from "react-icons/fa";

const RoleModal = ({ isOpen, onClose, role, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        displayName: role.displayName || "",
        description: role.description || "",
        isActive: role.isActive !== undefined ? role.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        displayName: "",
        description: "",
        isActive: true,
      });
    }
    setError("");
  }, [role, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("اسم الدور مطلوب");
      }
      if (!formData.displayName.trim()) {
        throw new Error("الاسم المعروض مطلوب");
      }

      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        displayName: formData.displayName.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      await onSave(role ? role.id : null, submitData);
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {role ? "تعديل الدور" : "إضافة دور جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaTag className="inline ml-1" />
                اسم الدور
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: manager"
                required
                disabled={role?.isSystemRole}
              />
              {role?.isSystemRole && (
                <p className="text-xs text-gray-500 mt-1">
                  لا يمكن تعديل اسم الأدوار النظامية
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم المعروض
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: مدير المطعم"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaAlignLeft className="inline ml-1" />
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="وصف الدور وصلاحياته..."
              />
            </div>

            {role && (
              <div>
                <label className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={role?.isSystemRole}
                  />
                  <span className="text-sm text-gray-700">دور نشط</span>
                </label>
                {role?.isSystemRole && (
                  <p className="text-xs text-gray-500 mt-1">
                    لا يمكن إلغاء تفعيل الأدوار النظامية
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {loading ? "جاري الحفظ..." : role ? "تحديث" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
