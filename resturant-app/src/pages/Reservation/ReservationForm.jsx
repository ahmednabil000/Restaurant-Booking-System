// src/components/ReservationForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import TimePicker from "../../components/ui/TimePicker";
import useRestaurantStore from "../../store/restaurantStore";
import { getAvailableTables } from "../../services/reservationService";
import { useReserveTableMutation } from "../../hooks/useReservation";
import { useCartQuery } from "../../hooks/useCart";

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
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" or "cash"

  const { fetchRestaurantDetails } = useRestaurantStore();
  const reserveTableMutation = useReserveTableMutation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const { data: cartResponse } = useCartQuery();
  const queryClient = useQueryClient();

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

    // Get cart items
    const cartData = cartResponse?.success ? cartResponse.cart : null;
    const cartItems = cartData?.items || [];

    if (cartItems.length === 0) {
      alert("يجب إضافة وجبات للسلة أولاً");
      return;
    }

    // If payment method is cash, save reservation directly
    if (paymentMethod === "cash") {
      const reservationData = {
        name: formData.name,
        phone: formData.phone,
        guests: formData.guests,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        tableNumber: formData.tableNumber,
        notes: formData.notes,
        paymentMethod: "cash",
      };

      reserveTableMutation.mutate(reservationData, {
        onSuccess: () => {
          // Remove any existing notifications
          const existingNotification = document.getElementById(
            "reservation-cash-success-notification"
          );
          if (existingNotification) {
            existingNotification.remove();
          }

          // Show enhanced success notification
          const notification = document.createElement("div");
          notification.id = "reservation-cash-success-notification";
          notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: white;
            color: #1f2937;
            padding: 0;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
            max-width: 500px;
            width: 90%;
            opacity: 0;
            animation: fadeInScale 0.4s ease-out forwards;
            font-family: system-ui, -apple-system, sans-serif;
          `;

          // Add animation keyframes
          if (!document.getElementById("notification-animations")) {
            const style = document.createElement("style");
            style.id = "notification-animations";
            style.textContent = `
              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1);
                }
              }
              @keyframes fadeOutScale {
                from {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1);
                }
                to {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(0.9);
                }
              }
            `;
            document.head.appendChild(style);
          }

          notification.innerHTML = `
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" fill="#10b981" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 8px 0;">تم تأكيد الحجز بنجاح!</h2>
              <p style="color: rgba(255, 255, 255, 0.95); font-size: 16px; margin: 0;">رقم الطاولة: ${formData.tableNumber}</p>
            </div>
            
            <div style="padding: 24px;">
              <div style="background: #fef3c7; border-right: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; align-items: start; gap: 12px;">
                  <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 20 20" style="flex-shrink: 0; margin-top: 2px;">
                    <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <div style="flex: 1;">
                    <p style="font-weight: 600; color: #92400e; margin: 0 0 4px 0; font-size: 15px;">الدفع عند الوصول</p>
                    <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.5;">يرجى إحضار المبلغ نقداً عند الحضور للمطعم</p>
                  </div>
                </div>
              </div>

              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 12px 0; text-align: right;">تفاصيل الحجز</h3>
                <div style="display: grid; gap: 8px;">
                  <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: #1f2937; font-weight: 500;">${formData.name}</span>
                    <span style="color: #6b7280;">الاسم:</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: #1f2937; font-weight: 500;">${formData.date}</span>
                    <span style="color: #6b7280;">التاريخ:</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: #1f2937; font-weight: 500;">${formData.startTime} - ${formData.endTime}</span>
                    <span style="color: #6b7280;">الوقت:</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span style="color: #1f2937; font-weight: 500;">${formData.guests} أشخاص</span>
                    <span style="color: #6b7280;">عدد الضيوف:</span>
                  </div>
                </div>
              </div>

              <p style="color: #6b7280; font-size: 13px; text-align: center; margin: 0 0 20px 0;">سيتم التواصل معك عبر رقم الهاتف لتأكيد الحجز</p>

              <button 
                onclick="this.closest('[id=reservation-cash-success-notification]').style.animation='fadeOutScale 0.3s ease-out forwards'; setTimeout(() => { this.closest('[id=reservation-cash-success-notification]').remove(); window.location.href='/'; }, 300);"
                style="width: 100%; padding: 12px; background: #e26136; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s;"
                onmouseover="this.style.background='#cd4f25'"
                onmouseout="this.style.background='#e26136'"
              >
                العودة للرئيسية
              </button>
            </div>
          `;

          // Add backdrop
          const backdrop = document.createElement("div");
          backdrop.id = "notification-backdrop";
          backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease-out;
          `;

          document.body.appendChild(backdrop);
          document.body.appendChild(notification);

          // Fade in backdrop
          requestAnimationFrame(() => {
            backdrop.style.opacity = "1";
          });

          // Invalidate cart query to refresh cart count
          queryClient.invalidateQueries(["cart"]);

          // Auto close after 8 seconds
          setTimeout(() => {
            notification.style.animation =
              "fadeOutScale 0.3s ease-out forwards";
            backdrop.style.opacity = "0";

            setTimeout(() => {
              if (notification.parentNode) notification.remove();
              if (backdrop.parentNode) backdrop.remove();
              navigate("/");
            }, 300);
          }, 8000);
        },
        onError: (error) => {
          console.error("Reservation failed:", error);
          alert("فشل في حجز الطاولة. حاول مرة أخرى.");
        },
      });
      return;
    }

    // Online payment with Stripe
    const { restaurant } = useRestaurantStore.getState();
    const serviceFees =
      +restaurant?.data?.serviceFees || +restaurant?.serviceFees || 5.0;

    // Prepare line items for Stripe from cart
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: item.meal?.name || "Meal",
          description: item.meal?.description || "",
        },
        unit_amount: Math.round((item.meal?.price || 0) * 100), // Convert to piasters (1 EGP = 100 piasters)
      },
      quantity: item.quantity,
    }));

    // Add service fees as a separate line item
    lineItems.push({
      price_data: {
        currency: "egp",
        product_data: {
          name: "رسوم الخدمة",
          description: "Service Fees",
        },
        unit_amount: Math.round(serviceFees * 100), // Convert to piasters
      },
      quantity: 1,
    });

    try {
      // Create Stripe checkout session
      const response = await fetch(
        "http://localhost:8080/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineItems,
            metadata: {
              reservationData: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                guests: formData.guests,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                tableNumber: formData.tableNumber,
                notes: formData.notes,
                paymentMethod: "card",
              }),
            },
          }),
        }
      );

      const session = await response.json();

      if (response.ok) {
        // Redirect to Stripe Checkout
        if (session.url) {
          window.location.href = session.url;
        } else if (session.sessionId || session.id) {
          // Fallback: use Stripe.js redirect
          const sessionId = session.sessionId || session.id;
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
              console.error("Stripe redirect error:", error);
              alert("فشل في التوجيه لصفحة الدفع");
            }
          }
        } else {
          console.error("Unexpected response:", session);
          alert("حدث خطأ في إنشاء جلسة الدفع");
        }
      } else {
        console.error("Backend error:", session);
        alert("فشل في إنشاء جلسة الدفع");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("حدث خطأ أثناء عملية الدفع");
    }

    // OLD CODE - Keep for reference if you want to save reservation without payment
    /*
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
    */
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

        {/* Payment Method Selection */}
        <div className="mb-5">
          <label
            className="block text-sm font-medium text-gray-700 mb-3"
            dir="rtl"
          >
            طريقة الدفع
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Online Payment Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "online"
                  ? "border-[#e26136] bg-orange-50 text-[#e26136]"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="font-semibold text-sm">الدفع أونلاين</span>
              <span className="text-xs mt-1 opacity-75">عبر Stripe</span>
            </button>

            {/* Cash Payment Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "cash"
                  ? "border-[#e26136] bg-orange-50 text-[#e26136]"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-semibold text-sm">الدفع في المطعم</span>
              <span className="text-xs mt-1 opacity-75">
                نقداً عند الاستلام
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={reserveTableMutation.isLoading}
          className={`w-full cursor-pointer py-3 px-6 rounded-lg font-medium text-base text-white transition-colors ${
            reserveTableMutation.isLoading
              ? "bg-[#cd4f25] cursor-not-allowed"
              : "bg-[#e26136] hover:bg-[#cd4f25]"
          }`}
        >
          {reserveTableMutation.isLoading ? "جاري المعالجة..." : "احجز الآن"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
