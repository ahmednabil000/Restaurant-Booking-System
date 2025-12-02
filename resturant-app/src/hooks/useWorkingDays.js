import { useState, useEffect, useCallback } from "react";
import * as workingDaysService from "../services/workingDaysService";

export const useWorkingDays = () => {
  const [workingDays, setWorkingDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWorkingDays = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading working days...");
      const response = await workingDaysService.getAllWorkingDays();

      console.log("Working days response:", response); // Debug log

      if (response.success) {
        const daysData = Array.isArray(response.data) ? response.data : [];
        console.log("Working days data:", daysData); // Debug log
        console.log("Number of working days:", daysData.length);
        setWorkingDays(daysData);
        setError(null);
      } else {
        console.error("Working days error:", response.error);
        setError(response.error || "خطأ في تحميل أوقات العمل");
      }
    } catch (err) {
      console.error("Working days exception:", err);
      setError(err.message || "خطأ في تحميل أوقات العمل");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkingDays();
  }, [loadWorkingDays]);

  // Helper functions
  const getActiveWorkingDays = () => {
    return workingDays.filter((day) => day.isActive);
  };

  const getWorkingDayByName = (dayName) => {
    return workingDays.find(
      (day) => day.name.toLowerCase() === dayName.toLowerCase()
    );
  };

  const isWorkingDay = (dayName) => {
    const day = getWorkingDayByName(dayName);
    return day && day.isActive;
  };

  const getWorkingHours = (dayName) => {
    const day = getWorkingDayByName(dayName);
    if (day && day.isActive) {
      return {
        start: day.startHour,
        end: day.endHour,
        isOpen: true,
      };
    }
    return {
      start: null,
      end: null,
      isOpen: false,
    };
  };

  const getCurrentDayStatus = () => {
    const today = new Date();
    const dayIndex = today.getDay();

    // Map day index to both English and Arabic names
    const dayMapping = {
      0: { english: "Sunday", arabic: "الأحد" },
      1: { english: "Monday", arabic: "الإثنين" },
      2: { english: "Tuesday", arabic: "الثلاثاء" },
      3: { english: "Wednesday", arabic: "الأربعاء" },
      4: { english: "Thursday", arabic: "الخميس" },
      5: { english: "Friday", arabic: "الجمعة" },
      6: { english: "Saturday", arabic: "السبت" },
    };

    const currentDay = dayMapping[dayIndex];

    // Try to find by Arabic name first, then English
    let dayData = getWorkingDayByName(currentDay.arabic);
    if (!dayData) {
      dayData = getWorkingDayByName(currentDay.english);
    }

    if (dayData && dayData.isActive) {
      return {
        start: dayData.startHour,
        end: dayData.endHour,
        isOpen: true,
      };
    }

    return {
      start: null,
      end: null,
      isOpen: false,
    };
  };

  const formatWorkingHours = (startHour, endHour) => {
    if (!startHour || !endHour) return "مغلق";

    const formatTime = (time) => {
      return time.substring(0, 5); // Remove seconds
    };

    return `${formatTime(startHour)} - ${formatTime(endHour)}`;
  };

  const getDayNameInArabic = (englishName) => {
    const dayMap = {
      Monday: "الاثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    };
    return dayMap[englishName] || englishName;
  };

  return {
    workingDays,
    loading,
    error,
    refreshWorkingDays: loadWorkingDays,
    // Helper functions
    getActiveWorkingDays,
    getWorkingDayByName,
    isWorkingDay,
    getWorkingHours,
    getCurrentDayStatus,
    formatWorkingHours,
    getDayNameInArabic,
  };
};
