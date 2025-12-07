import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaUtensils } from "react-icons/fa";
import * as tagsService from "../../../services/tagsService";

const MealsByTagModal = ({ isOpen, onClose, tag, onRemoveTag }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMeals = useCallback(async () => {
    if (!tag) return;
    setLoading(true);
    setError("");
    try {
      const response = await tagsService.getMealsByTags([tag.id]);
      if (response.success) {
        setMeals(response.data.meals || []);
      }
    } catch (err) {
      setError(err.message || "خطأ في تحميل الوجبات");
    } finally {
      setLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    if (isOpen && tag) {
      loadMeals();
    }
  }, [isOpen, tag, loadMeals]);

  const handleRemoveTag = async (mealId) => {
    if (!window.confirm("هل أنت متأكد من إزالة هذا التصنيف من الوجبة؟")) return;

    try {
      await tagsService.removeTagFromMeal(mealId, tag.id);
      await loadMeals();
      if (onRemoveTag) onRemoveTag();
    } catch (err) {
      setError(err.message || "خطأ في إزالة التصنيف");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            الوجبات المصنفة تحت:{" "}
            <span style={{ color: tag?.bgColor }}>{tag?.title}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جار تحميل الوجبات...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-8">
            <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">لا توجد وجبات مصنفة تحت هذا التصنيف</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
              >
                <img
                  src={meal.imageUrl || "/api/placeholder/60/60"}
                  alt={meal.title}
                  className="w-15 h-15 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{meal.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {meal.description}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {meal.price} ج.م
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {meal.tags &&
                      meal.tags.map((mealTag) => (
                        <span
                          key={mealTag.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: mealTag.bgColor,
                            color: mealTag.titleColor,
                          }}
                        >
                          {mealTag.title}
                        </span>
                      ))}
                  </div>
                  <button
                    onClick={() => handleRemoveTag(meal.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="إزالة التصنيف من هذه الوجبة"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealsByTagModal;
