import React from "react";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaClock,
  FaCalendarDay,
} from "react-icons/fa";

const WorkingDayCard = ({
  workingDay,
  onEdit,
  onDelete,
  onToggle,
  isSelected,
  onSelect,
}) => {
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive) => {
    return isActive ? "نشط" : "معطل";
  };

  const getDayNameInArabic = (name) => {
    const dayMap = {
      Monday: "الاثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    };
    return dayMap[name] || name;
  };

  const formatTime = (time) => {
    if (!time) return "غير محدد";
    // Remove seconds if present
    return time.substring(0, 5);
  };

  const calculateDuration = () => {
    if (!workingDay.startHour || !workingDay.endHour) return "غير محدد";

    const start = new Date(`1970-01-01T${workingDay.startHour}`);
    const end = new Date(`1970-01-01T${workingDay.endHour}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours} ساعة و ${diffMinutes} دقيقة`;
    } else if (diffHours > 0) {
      return `${diffHours} ساعة`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} دقيقة`;
    }
    return "غير صحيح";
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarDay className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">
                {getDayNameInArabic(workingDay.name)}
              </h3>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                workingDay.isActive
              )}`}
            >
              {getStatusText(workingDay.isActive)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <FaClock className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">
            من {formatTime(workingDay.startHour)} إلى{" "}
            {formatTime(workingDay.endHour)}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          مدة العمل: {calculateDuration()}
        </div>

        {!workingDay.isActive && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            هذا اليوم معطل حاليًا
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {workingDay.id && workingDay.id.substring(0, 8)}...
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(workingDay)}
            className={`p-2 rounded ${
              workingDay.isActive
                ? "text-green-600 hover:bg-green-50"
                : "text-red-600 hover:bg-red-50"
            }`}
            title={workingDay.isActive ? "إلغاء التفعيل" : "تفعيل"}
          >
            {workingDay.isActive ? <FaToggleOn /> : <FaToggleOff />}
          </button>

          <button
            onClick={() => onEdit(workingDay)}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
            title="تعديل"
          >
            <FaEdit className="text-sm" />
          </button>

          <button
            onClick={() => onDelete(workingDay)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="حذف"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkingDayCard;
