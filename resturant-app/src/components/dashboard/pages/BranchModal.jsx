import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import * as pagesService from "../../../services/pagesService";

const BranchModal = ({ isOpen, onClose, branch, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    openingHours: {
      monday: { open: "09:00", close: "22:00" },
      tuesday: { open: "09:00", close: "22:00" },
      wednesday: { open: "09:00", close: "22:00" },
      thursday: { open: "09:00", close: "22:00" },
      friday: { open: "09:00", close: "22:00" },
      saturday: { open: "09:00", close: "22:00" },
      sunday: { open: "09:00", close: "22:00" },
    },
    isActive: true,
    meta: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        address: branch.address || "",
        phone: branch.phone || "",
        openingHours: branch.openingHours || {
          monday: { open: "09:00", close: "22:00" },
          tuesday: { open: "09:00", close: "22:00" },
          wednesday: { open: "09:00", close: "22:00" },
          thursday: { open: "09:00", close: "22:00" },
          friday: { open: "09:00", close: "22:00" },
          saturday: { open: "09:00", close: "22:00" },
          sunday: { open: "09:00", close: "22:00" },
        },
        isActive: branch.isActive !== undefined ? branch.isActive : true,
        meta: branch.meta || {},
      });
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        openingHours: {
          monday: { open: "09:00", close: "22:00" },
          tuesday: { open: "09:00", close: "22:00" },
          wednesday: { open: "09:00", close: "22:00" },
          thursday: { open: "09:00", close: "22:00" },
          friday: { open: "09:00", close: "22:00" },
          saturday: { open: "09:00", close: "22:00" },
          sunday: { open: "09:00", close: "22:00" },
        },
        isActive: true,
        meta: {},
      });
    }
    setError("");
  }, [branch, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setError("اسم الفرع والعنوان مطلوبان");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      if (branch) {
        response = await pagesService.updateBranch(branch.id, formData);
      } else {
        response = await pagesService.createBranch(formData);
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

  const updateOpeningHours = (day, field, value) => {
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

  const updateMeta = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value,
      },
    }));
  };

  const dayLabels = {
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    sunday: "الأحد",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {branch ? "تعديل الفرع" : "إضافة فرع جديد"}
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
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الفرع *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="فرع وسط المدينة"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="العنوان الكامل للفرع"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+966500000000"
              />
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
                  الفرع نشط
                </span>
              </label>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">أوقات العمل</h4>
            <div className="space-y-3">
              {Object.keys(dayLabels).map((day) => (
                <div key={day} className="grid grid-cols-4 gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {dayLabels[day]}
                  </label>
                  <div>
                    <input
                      type="time"
                      value={formData.openingHours[day]?.open || "09:00"}
                      onChange={(e) =>
                        updateOpeningHours(day, "open", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      value={formData.openingHours[day]?.close || "22:00"}
                      onChange={(e) =>
                        updateOpeningHours(day, "close", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">افتتاح - إغلاق</div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Information */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">معلومات إضافية</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رابط الخريطة
                </label>
                <input
                  type="url"
                  value={formData.meta.mapUrl || ""}
                  onChange={(e) => updateMeta("mapUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  value={formData.meta.notes || ""}
                  onChange={(e) => updateMeta("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="ملاحظات خاصة بالفرع"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
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
                  {branch ? "تحديث" : "إضافة"}
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

export default BranchModal;
