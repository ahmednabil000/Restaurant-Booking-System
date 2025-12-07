import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSave,
  FaUser,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import * as employeesService from "../../../services/employeesService";
import useRestaurantStore from "../../../store/restaurantStore";
import Modal from "../../ui/Modal";

const EmployeeModal = ({ isOpen, onClose, employee, mode, onSave }) => {
  const { restaurant } = useRestaurantStore();

  const [formData, setFormData] = useState({
    fullName: "",
    job: "",
    birthDay: "",
    email: "",
    phone: "",
    salary: "",
    hireDate: "",
    isActive: true,
    resturantId: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (employee && mode !== "create") {
      setFormData({
        fullName: employee.fullName || "",
        job: employee.job || "",
        birthDay: employee.birthDay || "",
        email: employee.email || "",
        phone: employee.phone || "",
        salary: employee.salary || "",
        hireDate: employee.hireDate || "",
        isActive: employee.isActive !== undefined ? employee.isActive : true,
        resturantId: employee.resturantId || "",
      });
    } else if (mode === "create") {
      // Set default values for new employee
      const today = new Date().toISOString().split("T")[0];
      const restaurantId = restaurant?.id || restaurant?.data?.id || "";

      setFormData({
        fullName: "",
        job: "",
        birthDay: "",
        email: "",
        phone: "",
        salary: "",
        hireDate: today,
        isActive: true,
        resturantId: restaurantId,
      });
    }
  }, [employee, mode, isOpen, restaurant?.id, restaurant?.data?.id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    } else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
      newErrors.fullName = "الاسم يجب أن يكون بين 2-100 حرف";
    }

    if (!formData.job) {
      newErrors.job = "الوظيفة مطلوبة";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "تاريخ التوظيف مطلوب";
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // Phone validation (optional)
    if (
      formData.phone &&
      (formData.phone.length < 10 || formData.phone.length > 20)
    ) {
      newErrors.phone = "رقم الهاتف يجب أن يكون بين 10-20 رقم";
    }

    // Salary validation (optional)
    if (
      formData.salary &&
      (isNaN(formData.salary) || parseFloat(formData.salary) < 0)
    ) {
      newErrors.salary = "الراتب يجب أن يكون رقم موجب";
    }

    // Birthday validation (optional)
    if (formData.birthDay) {
      const birthDate = new Date(formData.birthDay);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.birthDay = "تاريخ الميلاد يجب أن يكون في الماضي";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const employeeData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        // Remove empty strings
        email: formData.email || null,
        phone: formData.phone || null,
        birthDay: formData.birthDay || null,
      };

      await onSave(employeeData);
    } catch (error) {
      console.error("Error saving employee:", error);
      setErrors({ general: error.message || "حدث خطأ أثناء الحفظ" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  const isReadOnly = mode === "view";
  const isCreate = mode === "create";

  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#e26136] rounded-lg">
        <FaUser className="text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {isCreate
            ? "إضافة موظف جديد"
            : mode === "edit"
            ? "تعديل الموظف"
            : "عرض بيانات الموظف"}
        </h2>
        <p className="text-sm text-gray-600">
          {isCreate
            ? "إدخال بيانات الموظف الجديد"
            : `بيانات ${employee?.fullName || "الموظف"}`}
        </p>
      </div>
    </div>
  );

  const footerContent = !isReadOnly ? (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
      >
        إلغاء
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-[#e26136] text-white rounded-lg hover:bg-[#cd4f25] font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            جاري الحفظ...
          </>
        ) : (
          <>
            <FaSave className="text-sm" />
            {isCreate ? "إضافة الموظف" : "حفظ التغييرات"}
          </>
        )}
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors duration-200"
      >
        إغلاق
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerContent={headerContent}
      footerContent={footerContent}
      maxWidth="max-w-5xl"
      maxHeight="max-h-[95vh]"
      showCloseButton={false}
    >
      <div className="p-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                المعلومات الشخصية
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-gray-400" />
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" />
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  name="birthDay"
                  value={formatDate(formData.birthDay)}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.birthDay ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.birthDay && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDay}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-gray-400" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-gray-400" />
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="01xxxxxxxxx"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Job Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                المعلومات الوظيفية
              </h3>

              {/* Job Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBriefcase className="inline mr-2 text-gray-400" />
                  الوظيفة *
                </label>
                <select
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.job ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">اختر الوظيفة</option>
                  {employeesService.JOB_POSITIONS.map((job) => (
                    <option key={job} value={job}>
                      {employeesService.getJobInArabic(job)}
                    </option>
                  ))}
                </select>
                {errors.job && (
                  <p className="text-red-500 text-sm mt-1">{errors.job}</p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-gray-400" />
                  الراتب (ج.م)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.salary ? "border-red-500" : "border-gray-300"}`}
                  placeholder="5000.00"
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" />
                  تاريخ التوظيف *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formatDate(formData.hireDate)}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent ${
                    isReadOnly ? "bg-gray-100" : ""
                  } ${errors.hireDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.hireDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الموظف
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className="w-4 h-4 text-[#e26136] border-gray-300 rounded focus:ring-[#e26136]"
                  />
                  <label className="mr-2 text-sm text-gray-700">موظف نشط</label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  إلغاء التفعيل يعني أن الموظف لم يعد يعمل في المطعم
                </p>
              </div>

              {/* Employee ID (Read-only for existing employees) */}
              {!isCreate && employee?.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معرف الموظف
                  </label>
                  <input
                    type="text"
                    value={employee.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EmployeeModal;
