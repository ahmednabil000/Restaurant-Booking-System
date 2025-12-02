import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import * as branchesService from "../../../services/branchesService";

const BranchModal = ({ branch, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    country: "Saudi Arabia",
    zipCode: "",
    landmark: "",
    isActive: true,
    openingHours: {
      monday: { open: "09:00", close: "22:00" },
      tuesday: { open: "09:00", close: "22:00" },
      wednesday: { open: "09:00", close: "22:00" },
      thursday: { open: "09:00", close: "22:00" },
      friday: { open: "14:00", close: "23:30" },
      saturday: { open: "09:00", close: "22:00" },
      sunday: { open: "09:00", close: "22:00" },
    },
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
        latitude: branch.latitude?.toString() || "",
        longitude: branch.longitude?.toString() || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "Saudi Arabia",
        zipCode: branch.zipCode || "",
        landmark: branch.landmark || "",
        isActive: branch.isActive ?? true,
        openingHours: branch.openingHours || {
          monday: { open: "09:00", close: "22:00" },
          tuesday: { open: "09:00", close: "22:00" },
          wednesday: { open: "09:00", close: "22:00" },
          thursday: { open: "09:00", close: "22:00" },
          friday: { open: "14:00", close: "23:30" },
          saturday: { open: "09:00", close: "22:00" },
          sunday: { open: "09:00", close: "22:00" },
        },
        meta: branch.meta || {},
      });
    } else {
      // Reset form for new branch
      setFormData({
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        city: "",
        state: "",
        country: "Saudi Arabia",
        zipCode: "",
        landmark: "",
        isActive: true,
        openingHours: {
          monday: { open: "09:00", close: "22:00" },
          tuesday: { open: "09:00", close: "22:00" },
          wednesday: { open: "09:00", close: "22:00" },
          thursday: { open: "09:00", close: "22:00" },
          friday: { open: "14:00", close: "23:30" },
          saturday: { open: "09:00", close: "22:00" },
          sunday: { open: "09:00", close: "22:00" },
        },
        meta: {},
      });
    }
    setError("");
  }, [branch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleMetaChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.address ||
        !formData.phone ||
        !formData.city
      ) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      // Convert coordinates to numbers if provided
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      let result;
      if (branch) {
        result = await branchesService.updateBranch(branch.id, submitData);
      } else {
        result = await branchesService.createBranch(submitData);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "خطأ في حفظ الفرع");
      }
    } catch (error) {
      setError(error.message || "خطأ في حفظ الفرع");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {branch ? "تحرير الفرع" : "إضافة فرع جديد"}
            </h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">
                  المعلومات الأساسية
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الفرع *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966xxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المنطقة/الولاية
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البلد
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    معلم مميز
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="بجوار مول الرياض"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      خط العرض
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="24.7136"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      خط الطول
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="46.6753"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    الفرع نشط
                  </label>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">
                  أوقات العمل
                </h3>

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

                {/* Meta Information */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    معلومات إضافية
                  </h4>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      رابط الخريطة
                    </label>
                    <input
                      type="url"
                      value={formData.meta.mapUrl || ""}
                      onChange={(e) =>
                        handleMetaChange("mapUrl", e.target.value)
                      }
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaSave />
                  {branch ? "حفظ التغييرات" : "إضافة الفرع"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
