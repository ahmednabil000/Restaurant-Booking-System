// src/components/ReservationForm.jsx
import React, { useState } from "react";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import TimePicker from "../../components/ui/TimePicker";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Generate guest options (1 to 10)
  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} شخص`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Real-time validation for phone
    if (name === "phone" && value.trim()) {
      const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$|^\+[1-9]\d{1,14}$/;
      const newErrors = { ...errors };

      // Remove any non-digit characters for validation (except +)
      const cleanPhone = value.replace(/[^+\d]/g, "");

      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone =
          "رقم الهاتف غير صحيح (مثال: 966501234567 أو +966501234567)";
      } else {
        delete newErrors.phone;
      }

      setErrors(newErrors);
    }

    // Real-time validation for time fields
    if ((name === "startTime" || name === "endTime") && value) {
      const updatedFormData = { ...formData, [name]: value };

      // Clear related time errors when user makes changes
      const newErrors = { ...errors };
      if (name === "startTime") {
        delete newErrors.startTime;
        delete newErrors.endTime; // Clear end time errors as they depend on start time
      } else if (name === "endTime") {
        delete newErrors.endTime;
      }

      // Validate time relationship if both times are available
      if (updatedFormData.startTime && updatedFormData.endTime) {
        const startTime = new Date(
          `1970-01-01T${updatedFormData.startTime}:00`
        );
        const endTime = new Date(`1970-01-01T${updatedFormData.endTime}:00`);

        if (endTime <= startTime) {
          newErrors.endTime = "وقت النهاية يجب أن يكون بعد وقت البداية";
        } else {
          // Check minimum duration (at least 1 hour)
          const diffInMs = endTime - startTime;
          const diffInHours = diffInMs / (1000 * 60 * 60);

          if (diffInHours < 1) {
            newErrors.endTime = "مدة الحجز يجب أن تكون ساعة واحدة على الأقل";
          }
        }
      }

      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // (email field removed)

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    }

    // Enhanced Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else {
      const cleanPhone = formData.phone.replace(/[^+\d]/g, "");
      const saudiPhoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
      const internationalPhoneRegex = /^\+[1-9]\d{1,14}$/;

      if (
        !saudiPhoneRegex.test(cleanPhone) &&
        !internationalPhoneRegex.test(cleanPhone)
      ) {
        if (cleanPhone.length < 8) {
          newErrors.phone = "رقم الهاتف قصير جداً";
        } else if (cleanPhone.length > 15) {
          newErrors.phone = "رقم الهاتف طويل جداً";
        } else {
          newErrors.phone =
            "رقم الهاتف غير صحيح (مثال: 966501234567 أو +966501234567)";
        }
      }
    }

    if (!formData.date) {
      newErrors.date = "تاريخ الحجز مطلوب";
    }

    if (!formData.startTime) {
      newErrors.startTime = "وقت البداية مطلوب";
    }

    if (!formData.endTime) {
      newErrors.endTime = "وقت النهاية مطلوب";
    }

    // Validate that end time is after start time
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
      const endTime = new Date(`1970-01-01T${formData.endTime}:00`);

      if (endTime <= startTime) {
        newErrors.endTime = "وقت النهاية يجب أن يكون بعد وقت البداية";
      } else {
        // Check minimum duration (at least 1 hour) only if end time is after start time
        const diffInMs = endTime - startTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 1) {
          newErrors.endTime = "مدة الحجز يجب أن تكون ساعة واحدة على الأقل";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        guests: "2",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
      });
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div
      className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200"
      dir="rtl"
    >
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center text-base font-medium">
          ✅ تم تأكيد حجزك بنجاح!
        </div>
      )}

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        معلومات الحجز
      </h2>
      <p className="text-base text-gray-600 text-center mb-8">
        الرجاء ملء الخانات التالية لإكمال حجز طاولتك.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <TextInput
          label="الاسم الكامل"
          placeholder="اسمك الكامل"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

        {/* Phone */}
        <TextInput
          label="رقم الهاتف"
          placeholder="+966501234567"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          error={errors.phone}
        />

        {/* Guests */}
        <SelectInput
          label="عدد الأشخاص"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          options={guestOptions}
          required
          error={errors.guests}
        />

        {/* Date */}
        <TextInput
          label="تاريخ الحجز"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />

        {/* Start Time */}
        <TimePicker
          label="وقت البداية"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          error={errors.startTime}
        />

        {/* End Time */}
        <TimePicker
          label="وقت النهاية"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          error={errors.endTime}
        />

        {/* Special Notes */}
        <TextInput
          label="ملاحظات خاصة (اختياري)"
          placeholder="أي طلبات خاصة أو ملاحظات؟"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full cursor-pointer py-3 px-6 rounded-lg font-medium text-base text-white transition-colors ${
            isSubmitting
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "جاري التأكيد..." : "تأكيد الحجز"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
