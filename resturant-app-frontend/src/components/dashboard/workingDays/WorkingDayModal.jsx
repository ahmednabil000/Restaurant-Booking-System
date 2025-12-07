import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner } from "react-icons/fa";
import * as workingDaysService from "../../../services/workingDaysService";

const WorkingDayModal = ({ isOpen, onClose, workingDay, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    startHour: "09:00",
    endHour: "22:00",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const daysOptions = [
    { value: "Monday", label: "الاثنين" },
    { value: "Tuesday", label: "الثلاثاء" },
    { value: "Wednesday", label: "الأربعاء" },
    { value: "Thursday", label: "الخميس" },
    { value: "Friday", label: "الجمعة" },
    { value: "Saturday", label: "السبت" },
    { value: "Sunday", label: "الأحد" },
  ];

  useEffect(() => {
    if (workingDay) {
      setFormData({
        name: workingDay.name || "",
        startHour: workingDay.startHour
          ? workingDay.startHour.substring(0, 5)
          : "09:00",
        endHour: workingDay.endHour
          ? workingDay.endHour.substring(0, 5)
          : "22:00",
        isActive:
          workingDay.isActive !== undefined ? workingDay.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        startHour: "09:00",
        endHour: "22:00",
        isActive: true,
      });
    }
    setError("");
  }, [workingDay, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("اسم اليوم مطلوب");
      return;
    }

    if (formData.startHour >= formData.endHour) {
      setError("وقت النهاية يجب أن يكون بعد وقت البداية");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        startHour: formData.startHour,
        endHour: formData.endHour,
      };

      let response;
      if (workingDay) {
        response = await workingDaysService.updateWorkingDay(
          workingDay.id,
          submitData
        );
      } else {
        response = await workingDaysService.createWorkingDay(submitData);
      }

      if (response.success) {
        onSave();
        onClose();
      } else {
        setError(response.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!formData.startHour || !formData.endHour) return "غير محدد";

    const start = new Date(`1970-01-01T${formData.startHour}:00`);
    const end = new Date(`1970-01-01T${formData.endHour}:00`);
    const diffMs = end - start;

    if (diffMs <= 0) return "غير صحيح";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {workingDay ? "تعديل يوم العمل" : "إضافة يوم عمل جديد"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اليوم *
            </label>
            <select
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">اختر اليوم</option>
              {daysOptions.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وقت البداية *
              </label>
              <input
                type="time"
                value={formData.startHour}
                onChange={(e) =>
                  setFormData({ ...formData, startHour: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وقت النهاية *
              </label>
              <input
                type="time"
                value={formData.endHour}
                onChange={(e) =>
                  setFormData({ ...formData, endHour: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              مدة العمل:{" "}
              <span className="font-medium">{calculateDuration()}</span>
            </span>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                اليوم نشط
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جار الحفظ...
                </>
              ) : (
                <>
                  <FaSave />
                  {workingDay ? "تحديث" : "إضافة"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkingDayModal;
