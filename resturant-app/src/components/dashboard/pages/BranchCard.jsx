import React from "react";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";

const BranchCard = ({ branch, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive) => {
    return isActive ? "نشط" : "غير نشط";
  };

  const formatOpeningHours = (openingHours) => {
    if (!openingHours) return "غير محدد";

    const days = Object.keys(openingHours);
    if (days.length === 0) return "غير محدد";

    // Show first available day as example
    const firstDay = days[0];
    const hours = openingHours[firstDay];

    if (hours && hours.open && hours.close) {
      return `${hours.open} - ${hours.close}`;
    }

    return "غير محدد";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800">{branch.name}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                branch.isActive
              )}`}
            >
              {getStatusText(branch.isActive)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
              <span className="line-clamp-2">{branch.address}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaPhone className="text-gray-400 flex-shrink-0" />
              <span>{branch.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-gray-400 flex-shrink-0" />
              <span>{formatOpeningHours(branch.openingHours)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          تم الإنشاء: {new Date(branch.createdAt).toLocaleDateString("ar-SA")}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStatus(branch)}
            className={`p-2 rounded ${
              branch.isActive
                ? "text-green-600 hover:bg-green-50"
                : "text-red-600 hover:bg-red-50"
            }`}
            title={branch.isActive ? "إلغاء التفعيل" : "تفعيل"}
          >
            {branch.isActive ? <FaToggleOn /> : <FaToggleOff />}
          </button>

          <button
            onClick={() => onEdit(branch)}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
            title="تعديل"
          >
            <FaEdit className="text-sm" />
          </button>

          <button
            onClick={() => onDelete(branch)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="حذف"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* Additional info */}
      {branch.meta && Object.keys(branch.meta).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
              بيانات إضافية متوفرة
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchCard;
