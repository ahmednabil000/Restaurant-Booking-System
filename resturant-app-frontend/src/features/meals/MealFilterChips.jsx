// src/components/FilterChips.jsx
import React from "react";
import { FaLeaf, FaFire, FaStar, FaTag } from "react-icons/fa";
import { FaWheatAwnCircleExclamation } from "react-icons/fa6";
import { useTagsQuery } from "../../hooks/useTags";

const MealFilterChips = ({ selectedFilters, onFilterChange }) => {
  const { data: tagsData, isLoading, error } = useTagsQuery();

  // Fallback filters in case API fails
  const fallbackFilters = [
    { id: "vegetarian", name: "نباتي", icon: <FaLeaf size={16} /> },
    { id: "spicy", name: "حار", icon: <FaFire size={16} /> },
    {
      id: "glutenFree",
      name: "خالي من الغلوتين",
      icon: <FaWheatAwnCircleExclamation size={16} />,
    },
    { id: "mostPopular", name: "الأكثر طلباً", icon: <FaStar size={16} /> },
  ];

  // Map API tags to component format
  const getTagIcon = (tagTitle) => {
    const iconMap = {
      نباتي: <FaLeaf size={16} />,
      حار: <FaFire size={16} />,
      "خالي من الغلوتين": <FaWheatAwnCircleExclamation size={16} />,
      "الأكثر طلباً": <FaStar size={16} />,
      حلال: <FaStar size={16} />,
      حلويات: <FaStar size={16} />,
      شعبي: <FaTag size={16} />,
      مشروبات: <FaTag size={16} />,
      مشويات: <FaFire size={16} />,
      مقبلات: <FaTag size={16} />,
    };
    return iconMap[tagTitle] || <FaTag size={16} />;
  };

  // Process tags from API
  let filters = fallbackFilters;
  if (tagsData && tagsData.success && Array.isArray(tagsData.data)) {
    filters = tagsData.data.map((tag) => ({
      id: tag.id,
      name: tag.title,
      icon: getTagIcon(tag.title),
      bgColor: tag.bgColor,
      titleColor: tag.titleColor,
    }));
  } else if (tagsData && Array.isArray(tagsData)) {
    // Handle case where API returns tags directly as array
    filters = tagsData.map((tag) => ({
      id: tag.id || tag.name || tag,
      name: tag.name || tag,
      icon: getTagIcon(tag.name || tag),
    }));
  }

  const handleToggle = (filterId) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center mb-6">
        <div className="animate-pulse flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-full h-8 w-16"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state with fallback
  if (error) {
    console.warn(
      "Failed to load tags from API, using fallback filters:",
      error
    );
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 justify-center sm:justify-start">
      {filters.map((filter) => {
        const isSelected = selectedFilters.includes(filter.id);
        const buttonStyle =
          filter.bgColor && filter.titleColor
            ? {
                backgroundColor: isSelected ? filter.bgColor : "transparent",
                color: isSelected ? filter.titleColor : "#374151",
                borderColor: filter.bgColor,
              }
            : {};

        return (
          <button
            key={filter.id}
            onClick={() => handleToggle(filter.id)}
            style={buttonStyle}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 transition-colors border ${
              filter.bgColor && filter.titleColor
                ? isSelected
                  ? "border-current"
                  : "hover:bg-gray-100"
                : isSelected
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            }`}
          >
            {filter.icon}
            <span className="whitespace-nowrap">{filter.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MealFilterChips;
