// src/components/ReservationForm.jsx
import React, { useState } from "react";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import TimePicker from "../../components/ui/TimePicker";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.date) {
      newErrors.date = "تاريخ الحجز مطلوب";
    }

    if (!formData.time) {
      newErrors.time = "وقت الحجز مطلوب";
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
        email: "",
        name: "",
        phone: "",
        guests: "2",
        date: "",
        time: "",
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
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center text-lg font-medium">
          ✅ تم تأكيد حجزك بنجاح!
        </div>
      )}

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        معلومات الحجز
      </h2>
      <p className="text-lg text-gray-600 text-center mb-8">
        الرجاء ملء الخانات التالية لإكمال حجز طاولتك.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <TextInput
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

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

        {/* Time */}
        <TimePicker
          label="وقت الحجز"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          error={errors.time}
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
          className={`w-full cursor-pointer py-4 px-6 rounded-lg font-medium text-lg text-white transition-colors ${
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
