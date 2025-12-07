import React from "react";
import { useWorkingDays } from "../hooks/useWorkingDays";

const RestaurantStatus = ({ showFullSchedule = false }) => {
  const {
    workingDays,
    loading,
    getCurrentDayStatus,
    formatWorkingHours,
    getActiveWorkingDays,
  } = useWorkingDays();

  // Local function to handle Arabic day names
  const getDayNameInArabic = (dayName) => {
    // Handle both English and Arabic day names from API
    const dayMap = {
      Monday: "الاثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
      // Arabic versions (in case API returns Arabic)
      الاثنين: "الاثنين",
      الإثنين: "الاثنين",
      الثلاثاء: "الثلاثاء",
      الأربعاء: "الأربعاء",
      الخميس: "الخميس",
      الجمعة: "الجمعة",
      السبت: "السبت",
      الأحد: "الأحد",
    };
    return dayMap[dayName] || dayName;
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-600">جاري تحميل حالة المطعم...</div>
    );
  }

  const currentStatus = getCurrentDayStatus();
  const activeWorkingDays = getActiveWorkingDays();

  const isCurrentlyOpen = () => {
    if (!currentStatus.isOpen) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return (
      currentTime >= currentStatus.start && currentTime <= currentStatus.end
    );
  };

  const openNow = isCurrentlyOpen();

  return (
    <div className="restaurant-status">
      {/* Current Status */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${
            openNow ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span
          className={`font-medium ${
            openNow ? "text-green-600" : "text-red-600"
          }`}
        >
          {openNow ? "مفتوح الآن" : "مغلق الآن"}
        </span>
        {currentStatus.isOpen && (
          <span className="text-sm text-gray-600">
            {formatWorkingHours(currentStatus.start, currentStatus.end)}
          </span>
        )}
      </div>

      {/* Full Schedule */}
      {showFullSchedule && (
        <div className="working-schedule">
          <h4 className="font-medium text-gray-800 mb-2">أوقات العمل</h4>
          <div className="space-y-1">
            {workingDays
              .filter((day) => day.isActive === true)
              .map((day) => (
                <div key={day.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {getDayNameInArabic(day.name)}
                  </span>
                  <span className="text-gray-700">
                    {formatWorkingHours(day.startHour, day.endHour)}
                  </span>
                </div>
              ))}
          </div>

          {activeWorkingDays.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              لم يتم تحديد أوقات العمل بعد
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantStatus;
