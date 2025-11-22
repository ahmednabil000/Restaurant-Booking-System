// src/components/FilterChips.jsx
import React from "react";
import { FaLeaf, FaFire, FaStar } from "react-icons/fa";
import { FaWheatAwnCircleExclamation } from "react-icons/fa6";

const MealFilterChips = ({ selectedFilters, onFilterChange }) => {
  const filters = [
    { id: "vegetarian", name: "نباتي", icon: <FaLeaf size={16} /> },
    { id: "spicy", name: "حار", icon: <FaFire size={16} /> },
    {
      id: "glutenFree",
      name: "خالي من الغلوتين",
      icon: <FaWheatAwnCircleExclamation size={16} />,
    },
    { id: "mostPopular", name: "الأكثر طلباً", icon: <FaStar size={16} /> },
  ];
  const handleToggle = (filterId) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 justify-center sm:justify-start">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleToggle(filter.id)}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 transition-colors ${
            selectedFilters.includes(filter.id)
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.icon}
          <span className="whitespace-nowrap">{filter.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MealFilterChips;
