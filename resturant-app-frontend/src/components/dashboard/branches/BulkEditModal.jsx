import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import * as branchesService from "../../../services/branchesService";

const BulkEditModal = ({ selectedBranches, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    isActive: "",
    city: "",
    state: "",
    country: "",
    openingHours: {
      apply: false,
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpeningHoursToggle = () => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        apply: !prev.openingHours.apply,
      },
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const applyUniformHours = () => {
    const { monday } = formData.openingHours;
    if (monday.open && monday.close) {
      const uniformHours = {
        open: monday.open,
        close: monday.close,
      };

      setFormData((prev) => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          tuesday: uniformHours,
          wednesday: uniformHours,
          thursday: uniformHours,
          friday: uniformHours,
          saturday: uniformHours,
          sunday: uniformHours,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare update data (only include non-empty fields)
      const updateData = {};

      if (formData.isActive !== "") {
        updateData.isActive = formData.isActive === "true";
      }

      if (formData.city.trim()) {
        updateData.city = formData.city.trim();
      }

      if (formData.state.trim()) {
        updateData.state = formData.state.trim();
      }

      if (formData.country.trim()) {
        updateData.country = formData.country.trim();
      }

      if (formData.openingHours.apply) {
        const openingHours = {};
        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];

        days.forEach((day) => {
          const dayHours = formData.openingHours[day];
          if (dayHours.open && dayHours.close) {
            openingHours[day] = {
              open: dayHours.open,
              close: dayHours.close,
            };
          }
        });

        if (Object.keys(openingHours).length > 0) {
          updateData.openingHours = openingHours;
        }
      }

      if (Object.keys(updateData).length === 0) {
        setError("يرجى تحديد حقل واحد على الأقل للتحديث");
        return;
      }

      const result = await branchesService.bulkUpdateBranches(
        selectedBranches,
        updateData
      );

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "خطأ في التحديث المجمع");
      }
    } catch (error) {
      setError(error.message || "خطأ في التحديث المجمع");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const days = {
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    sunday: "الأحد",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                تحرير مجمع للفروع
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                سيتم تطبيق التغييرات على {selectedBranches.length} فرع
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تحديث الحالة
                </label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">لا تغيير</option>
                  <option value="true">تفعيل الفروع</option>
                  <option value="false">إلغاء تفعيل الفروع</option>
                </select>
              </div>

              {/* Location Updates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تحديث المدينة
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="اتركه فارغاً لعدم التغيير"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تحديث المنطقة
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="اتركه فارغاً لعدم التغيير"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تحديث البلد
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="اتركه فارغاً لعدم التغيير"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.openingHours.apply}
                      onChange={handleOpeningHoursToggle}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      تحديث أوقات العمل
                    </span>
                  </label>

                  {formData.openingHours.apply && (
                    <button
                      type="button"
                      onClick={applyUniformHours}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      تطبيق نفس أوقات الاثنين على كل الأيام
                    </button>
                  )}
                </div>

                {formData.openingHours.apply && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    {Object.entries(days).map(([dayKey, dayName]) => (
                      <div key={dayKey} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-medium text-gray-700">
                          {dayName}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={formData.openingHours[dayKey]?.open || ""}
                            onChange={(e) =>
                              handleOpeningHoursChange(
                                dayKey,
                                "open",
                                e.target.value
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-500">إلى</span>
                          <input
                            type="time"
                            value={formData.openingHours[dayKey]?.close || ""}
                            onChange={(e) =>
                              handleOpeningHoursChange(
                                dayKey,
                                "close",
                                e.target.value
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحديث...
                </>
              ) : (
                <>
                  <FaSave />
                  تطبيق على {selectedBranches.length} فرع
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEditModal;
