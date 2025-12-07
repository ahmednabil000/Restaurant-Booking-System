import React from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { API_BASE_URL } from "../../../config/api";

const MealCard = ({ meal, onEdit, onDelete, onToggleAvailability }) => {
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/api/placeholder/80/80";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={getImageUrl(meal.imageUrl)}
          alt={meal.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800">{meal.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleAvailability(meal)}
                className={`p-1 rounded ${
                  meal.isAvailable
                    ? "text-green-600 hover:bg-green-50"
                    : "text-red-600 hover:bg-red-50"
                }`}
                title={meal.isAvailable ? "متاح" : "غير متاح"}
              >
                {meal.isAvailable ? (
                  <FaToggleOn className="text-lg" />
                ) : (
                  <FaToggleOff className="text-lg" />
                )}
              </button>
              <button
                onClick={() => onEdit(meal)}
                className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                title="تعديل"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => onDelete(meal)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="حذف"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {meal.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-green-600">{meal.price} ج.م</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {meal.category || meal.type}
              </span>
              {!meal.isAvailable && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  غير متاح
                </span>
              )}
            </div>
          </div>
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {meal.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: tag.bgColor,
                    color: tag.titleColor || "#fff",
                  }}
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;
