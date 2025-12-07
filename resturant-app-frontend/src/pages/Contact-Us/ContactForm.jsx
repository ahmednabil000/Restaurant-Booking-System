// src/components/ContactForm.jsx
import React, { useState } from "react";
import TextInput from "../../ui/TextInput";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة";
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
      setFormData({ name: "", email: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div
      className="w-full shrink-0 p-6 bg-white rounded-xl shadow-md border border-gray-200"
      dir="rtl"
    >
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center text-lg">
          ✅ تم إرسال رسالتك بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <TextInput
          label="الاسم"
          placeholder="اسمك الكامل"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={errors.name}
        />

        {/* Email Field */}
        <TextInput
          label="البريد الإلكتروني"
          placeholder="بريدك الإلكتروني"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
          error={errors.email}
        />

        {/* Message Field */}
        <TextInput
          label="رسالتك"
          placeholder="اكتب رسالتك هنا..."
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          error={errors.message}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white text-lg transition-colors ${
            isSubmitting
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
