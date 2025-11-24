import React, { useState } from "react";

const TimePicker = ({
  label,
  value,
  onChange,
  error = "",
  className = "",
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time slots (restaurant hours: 11:00 AM - 11:00 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 11; // 11 AM
    const endHour = 23; // 11 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      // Add :00 slot
      const hour24 = hour;
      const hour12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "مساءً" : "صباحاً";

      const timeValue24 = `${hour24.toString().padStart(2, "0")}:00`;
      const timeDisplay = `${hour12}:00 ${ampm}`;

      slots.push({
        value: timeValue24,
        label: timeDisplay,
        display: `${hour12}:00`,
        period: ampm,
      });

      // Add :30 slot (except for the last hour)
      if (hour < endHour) {
        const timeValue24_30 = `${hour24.toString().padStart(2, "0")}:30`;
        const timeDisplay_30 = `${hour12}:30 ${ampm}`;

        slots.push({
          value: timeValue24_30,
          label: timeDisplay_30,
          display: `${hour12}:30`,
          period: ampm,
        });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const selectedSlot = timeSlots.find((slot) => slot.value === value);

  const handleTimeSelect = (timeValue) => {
    const event = {
      target: {
        name: name,
        value: timeValue,
      },
    };
    onChange(event);
    setIsOpen(false);
  };

  return (
    <div className={`mb-5 relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-base border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-right flex justify-between items-center transition-all duration-200 hover:border-orange-300`}
        >
          <div className="flex items-center">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className={selectedSlot ? "text-gray-900" : "text-gray-500"}>
            {selectedSlot ? selectedSlot.label : "اختر الوقت المناسب"}
          </span>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-sm font-medium text-gray-600 px-3 py-2 border-b border-gray-100 text-right">
                الأوقات المتاحة
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => handleTimeSelect(slot.value)}
                    className={`p-3 cursor-pointer rounded-lg text-center transition-all duration-200 ${
                      value === slot.value
                        ? "bg-orange-500 text-white font-medium"
                        : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                    }`}
                  >
                    <div className="text-base font-medium">{slot.display}</div>
                    <div className="text-xs opacity-75">{slot.period}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default TimePicker;
