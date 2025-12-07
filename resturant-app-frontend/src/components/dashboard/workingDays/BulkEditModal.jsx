import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner, FaClock } from "react-icons/fa";
import * as workingDaysService from "../../../services/workingDaysService";

const BulkEditModal = ({ isOpen, onClose, selectedDays, onSave }) => {
  const [formData, setFormData] = useState({
    startHour: "",
    endHour: "",
    isActive: null, // null = no change, true/false = update
    updateHours: false,
    updateStatus: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setFormData({
        startHour: "",
        endHour: "",
        isActive: null,
        updateHours: false,
        updateStatus: false,
      });
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.updateHours && !formData.updateStatus) {
      setError("يجب اختيار نوع التحديث المطلوب");
      return;
    }

    if (formData.updateHours) {
      if (!formData.startHour || !formData.endHour) {
        setError("أوقات البداية والنهاية مطلوبة عند تحديث الأوقات");
        return;
      }
      if (formData.startHour >= formData.endHour) {
        setError("وقت النهاية يجب أن يكون بعد وقت البداية");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      // Prepare bulk update data
      const updates = selectedDays.map((day) => {
        const update = { id: day.id };

        if (formData.updateHours) {
          update.startHour = formData.startHour;
          update.endHour = formData.endHour;
        }

        if (formData.updateStatus && formData.isActive !== null) {
          update.isActive = formData.isActive;
        }

        return update;
      });

      const response = await workingDaysService.bulkUpdateWorkingDays(updates);

      if (response.success) {
        onSave();
        onClose();
      } else {
        setError(response.error || "حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء التحديث");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تعديل جماعي للأيام المحددة ({selectedDays.length})
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

        {/* Selected Days Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">الأيام المحددة:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedDays.map((day) => (
              <span
                key={day.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {getDayNameInArabic(day.name)}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Update Hours Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="updateHours"
                checked={formData.updateHours}
                onChange={(e) =>
                  setFormData({ ...formData, updateHours: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="updateHours"
                className="font-medium text-gray-700"
              >
                <FaClock className="inline ml-1" />
                تحديث أوقات العمل
              </label>
            </div>

            {formData.updateHours && (
              <div className="space-y-4 mt-4">
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
                    />
                  </div>
                </div>

                {/* Duration Preview */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    مدة العمل الجديدة:{" "}
                    <span className="font-medium">{calculateDuration()}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Update Status Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="updateStatus"
                checked={formData.updateStatus}
                onChange={(e) =>
                  setFormData({ ...formData, updateStatus: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="updateStatus"
                className="font-medium text-gray-700"
              >
                تحديث حالة التفعيل
              </label>
            </div>

            {formData.updateStatus && (
              <div className="mt-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive === true}
                      onChange={() =>
                        setFormData({ ...formData, isActive: true })
                      }
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      تفعيل جميع الأيام المحددة
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive === false}
                      onChange={() =>
                        setFormData({ ...formData, isActive: false })
                      }
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      إلغاء تفعيل جميع الأيام المحددة
                    </span>
                  </label>
                </div>
              </div>
            )}
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
                  جار التحديث...
                </>
              ) : (
                <>
                  <FaSave />
                  تحديث ({selectedDays.length}) أيام
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

export default BulkEditModal;
