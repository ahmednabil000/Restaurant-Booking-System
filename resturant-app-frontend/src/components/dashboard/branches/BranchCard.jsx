import React from "react";
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaClock } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const BranchCard = ({
  branch,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}) => {
  const formatOpeningHours = (openingHours) => {
    if (!openingHours) return "غير محدد";

    const days = {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    };

    const formatTime = (time) => {
      if (!time) return "";
      return time.substring(0, 5);
    };

    const todayKey = Object.keys(days)[new Date().getDay() - 1] || "monday";
    const todayHours = openingHours[todayKey];

    if (todayHours && todayHours.open && todayHours.close) {
      return `اليوم: ${formatTime(todayHours.open)} - ${formatTime(
        todayHours.close
      )}`;
    }

    return "مغلق اليوم";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {branch.name}
          </h3>
          {branch.landmark && (
            <p className="text-sm text-gray-500">{branch.landmark}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleStatus(branch.id)}
            disabled={isLoading}
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              branch.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            {branch.isActive ? (
              <MdToggleOn className="ml-1" />
            ) : (
              <MdToggleOff className="ml-1" />
            )}
            {branch.isActive ? "نشط" : "مغلق"}
          </button>
        </div>
      </div>

      {/* Location Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <div>{branch.address}</div>
            <div className="text-xs text-gray-500">
              {branch.city}, {branch.state}, {branch.country}
              {branch.zipCode && ` - ${branch.zipCode}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{branch.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {formatOpeningHours(branch.openingHours)}
          </span>
        </div>
      </div>

      {/* Location Coordinates */}
      {branch.latitude && branch.longitude && (
        <div className="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <FaGlobe className="h-3 w-3" />
            <span>
              خط العرض: {branch.latitude}, خط الطول: {branch.longitude}
            </span>
          </div>
        </div>
      )}

      {/* Meta Information */}
      {branch.meta && Object.keys(branch.meta).length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
          <div className="font-medium text-blue-800 mb-1">معلومات إضافية:</div>
          {Object.entries(branch.meta).map(([key, value]) => (
            <div key={key} className="text-blue-700">
              {key}: {value}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(branch)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          تحرير
        </button>
        <button
          onClick={() => onDelete(branch.id)}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </div>
  );
};

export default BranchCard;
