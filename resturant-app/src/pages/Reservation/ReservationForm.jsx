// src/components/ReservationForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import TimePicker from "../../components/ui/TimePicker";
import useRestaurantStore from "../../store/restaurantStore";
import { getAvailableTables } from "../../services/reservationService";
import { useReserveTableMutation } from "../../hooks/useReservation";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    startTime: "",
    endTime: "",
    tableNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tablesError, setTablesError] = useState(null);

  const { fetchRestaurantDetails } = useRestaurantStore();
  const reserveTableMutation = useReserveTableMutation();
  const navigate = useNavigate();

  // Generate guest options (1 to 10)
  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} شخص`,
  }));

  // Calculate date range: today to end of next month
  const today = new Date();
  const minDate = today.toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Last day of next month
  const maxDate = nextMonth.toISOString().split("T")[0]; // End of next month in YYYY-MM-DD format

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

    // If date or time changed, clear selected table number
    if (name === "date" || name === "startTime" || name === "endTime") {
      setFormData((prev) => ({ ...prev, tableNumber: "" }));
      setAvailableTables([]);
      setTablesError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

    // Table number: require selection only when there are available tables
    if (
      availableTables &&
      availableTables.length > 0 &&
      !formData.tableNumber
    ) {
      newErrors.tableNumber = "يرجى اختيار رقم طاولة";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare reservation data with the correct field mapping
    const reservationData = {
      name: formData.name,
      phone: formData.phone,
      guests: formData.guests, // Will be mapped to peopleNum in the service
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      tableNumber: formData.tableNumber,
      notes: formData.notes,
    };

    reserveTableMutation.mutate(reservationData, {
      onSuccess: () => {
        // Remove any existing notifications first
        const existingNotification = document.getElementById(
          "reservation-success-notification"
        );
        if (existingNotification) {
          existingNotification.remove();
        }

        // Create and show global notification
        const notification = document.createElement("div");
        notification.id = "reservation-success-notification";

        // Set initial styles
        notification.style.cssText = `
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 9999;
          background: linear-gradient(to right, #10b981, #059669);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 400px;
          transform: translateX(-100%);
          opacity: 0;
          transition: all 0.4s ease-out;
          font-family: system-ui, -apple-system, sans-serif;
        `;

        notification.innerHTML = `
          <div style="flex-shrink: 0;">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div style="flex: 1;">
            <p style="font-weight: bold; font-size: 18px; margin: 0;">تم تأكيد الحجز بنجاح!</p>
            <p style="font-size: 14px; opacity: 0.95; margin: 4px 0 0 0;">سيتم التواصل معك عبر رقم الهاتف المدخل</p>
          </div>
          <button onclick="this.parentElement.remove()" style="flex-shrink: 0; margin-left: 8px; background: none; border: none; color: white; cursor: pointer; padding: 4px; border-radius: 4px; transition: opacity 0.2s;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        `;

        // Add notification to the page
        document.body.appendChild(notification);

        // Animate in after a small delay
        requestAnimationFrame(() => {
          setTimeout(() => {
            notification.style.transform = "translateX(0)";
            notification.style.opacity = "1";
          }, 50);
        });

        // Remove notification after 5 seconds
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.style.transform = "translateX(-100%)";
            notification.style.opacity = "0";

            // Remove from DOM after animation completes
            setTimeout(() => {
              if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 400);
          }
        }, 5000);

        // Navigate to home page after showing notification
        setTimeout(() => {
          navigate("/");
        }, 2000);
      },
      onError: (error) => {
        console.error("Reservation failed:", error);
        // You can add error state here if needed
      },
    });
  };

  // Fetch restaurant details on mount and stash in global store
  useEffect(() => {
    fetchRestaurantDetails().catch(() => {});
  }, [fetchRestaurantDetails]);

  // Fetch available tables when date + times change and are valid
  useEffect(() => {
    const shouldFetch = formData.date && formData.startTime && formData.endTime;
    if (!shouldFetch) return;

    // Basic client-side time validation
    const start = new Date(`1970-01-01T${formData.startTime}:00`);
    const end = new Date(`1970-01-01T${formData.endTime}:00`);
    if (end <= start) return;

    const controller = new AbortController();

    const fetchTables = async () => {
      setLoadingTables(true);
      setTablesError(null);
      try {
        const result = await getAvailableTables({
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });
        console.log("Available tables API response:", result.rawResponse);
        console.log("Normalized tables:", result.availableTables);
        setAvailableTables(result.availableTables);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Table fetch error:", err);
          setTablesError("خطأ في تحميل الطاولات المتاحة");
        }
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();

    return () => controller.abort();
  }, [formData.date, formData.startTime, formData.endTime]);

  return (
    <div
      className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200"
      dir="rtl"
    >
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
          min={minDate}
          max={maxDate}
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

        {/* Table Number - depends on available tables fetched based on date/time */}
        <div className="mb-5">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            dir="rtl"
          >
            رقم الطاولة
          </label>
          {loadingTables ? (
            <div className="text-sm text-gray-600">
              جاري التحقق من الطاولات المتاحة...
            </div>
          ) : tablesError ? (
            <div className="text-sm text-red-600">{tablesError}</div>
          ) : availableTables && availableTables.length > 0 ? (
            <SelectInput
              label=""
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleChange}
              options={availableTables.map((t) => ({
                value: String(t),
                label: `طاولة ${t}`,
              }))}
              required
              error={errors.tableNumber}
            />
          ) : (
            <div className="text-sm text-gray-600">
              لا توجد طاولات متاحة لهذا الوقت
            </div>
          )}
        </div>

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
          disabled={reserveTableMutation.isLoading}
          className={`w-full cursor-pointer py-3 px-6 rounded-lg font-medium text-base text-white transition-colors ${
            reserveTableMutation.isLoading
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {reserveTableMutation.isLoading ? "جاري التأكيد..." : "تأكيد الحجز"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
