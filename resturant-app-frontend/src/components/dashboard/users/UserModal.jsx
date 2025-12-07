import React, { useState } from "react";
import { FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Modal from "../../ui/Modal";

const UserModal = ({ isOpen, onClose, user, onSave, availableRoles = [] }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || "customer",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "customer",
        password: "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        role: "customer",
        password: "",
      });
    }
    setError("");
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.fullName.trim()) {
        throw new Error("الاسم مطلوب");
      }
      if (!formData.email.trim()) {
        throw new Error("البريد الإلكتروني مطلوب");
      }
      if (!user && !formData.password.trim()) {
        throw new Error("كلمة المرور مطلوبة للمستخدمين الجدد");
      }

      // Prepare data for submission
      const submitData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      // Add password only for new users or when provided
      if (!user || formData.password.trim()) {
        submitData.password = formData.password;
      }

      await onSave(user ? user.id : null, submitData);
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline ml-1" />
              الاسم الكامل
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline ml-1" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدور
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="customer">عميل</option>
              <option value="staff">موظف</option>
              <option value="admin">مدير</option>
              <option value="owner">مالك</option>
              {availableRoles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.displayName || role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline ml-1" />
              {user ? "كلمة المرور (اختيارية)" : "كلمة المرور"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                user ? "اتركه فارغاً لعدم التغيير" : "أدخل كلمة المرور"
              }
              required={!user}
            />
          </div>
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
            {loading ? "جاري الحفظ..." : user ? "تحديث" : "إضافة"}
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
    </Modal>
  );
};

export default UserModal;
