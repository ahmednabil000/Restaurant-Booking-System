// src/components/SelectInput.jsx
import React from "react";

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  required = false,
  error = "",
  className = "",
  name,
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 text-base border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
      >
        <option value="" disabled>
          اختر...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;
