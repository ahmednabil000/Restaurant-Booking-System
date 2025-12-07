import React, { useState } from "react";
import { FaTimes, FaUserTag } from "react-icons/fa";

const AssignRoleModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  availableRoles = [],
}) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "customer");
    }
    setError("");
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSave(user.id, selectedRole);
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تعيين الدور");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            <FaUserTag className="inline ml-2" />
            تعيين دور للمستخدم
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

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">المستخدم:</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-800">{user.fullName}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                الدور الحالي: {user.role}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدور الجديد
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || selectedRole === user.role}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                loading || selectedRole === user.role
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {loading ? "جاري التعيين..." : "تعيين الدور"}
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

export default AssignRoleModal;
