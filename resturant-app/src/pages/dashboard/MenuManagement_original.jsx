import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTag,
  FaUtensils,
  FaSearch,
  FaTimes,
  FaPalette,
  FaEye,
  FaFilter,
  FaToggleOn,
  FaToggleOff,
  FaImage,
  FaSave,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as tagsService from "../../services/tagsService";
import * as mealsService from "../../services/mealsService";

// Tag Card Component
const TagCard = ({ tag, onEdit, onDelete, onViewMeals }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div 
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{ 
          backgroundColor: tag.bgColor || "#007bff", 
          color: tag.titleColor || "#fff" 
        }}
      >
        {tag.title}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewMeals(tag)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="عرض الوجبات"
        >
          <FaEye className="text-sm" />
        </button>
        <button
          onClick={() => onEdit(tag)}
          className="p-1 text-orange-600 hover:bg-orange-50 rounded"
          title="تعديل"
        >
          <FaEdit className="text-sm" />
        </button>
        <button
          onClick={() => onDelete(tag)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="حذف"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaPalette className="text-xs" />
      <span>الخلفية: {tag.bgColor || "#007bff"}</span>
      <span>النص: {tag.titleColor || "#fff"}</span>
    </div>
  </div>
);

// Meal Card Component
const MealCard = ({ meal, onEdit, onDelete, onToggleAvailability }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex gap-4">
      <img
        src={meal.imageUrl || "/api/placeholder/80/80"}
        alt={meal.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{meal.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleAvailability(meal)}
              className={`p-1 rounded ${meal.isAvailable ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
              title={meal.isAvailable ? "متاح" : "غير متاح"}
            >
              {meal.isAvailable ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
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
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{meal.description}</p>
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

// Tag Form Modal
const TagModal = ({ isOpen, onClose, tag, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    titleColor: "#ffffff",
    bgColor: "#007bff",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tag) {
      setFormData({
        title: tag.title || "",
        titleColor: tag.titleColor || "#ffffff",
        bgColor: tag.bgColor || "#007bff",
      });
    } else {
      setFormData({
        title: "",
        titleColor: "#ffffff",
        bgColor: "#007bff",
      });
    }
    setError("");
  }, [tag, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("عنوان التصنيف مطلوب");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (tag) {
        await tagsService.updateTag(tag.id, formData);
      } else {
        await tagsService.createTag(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {tag ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان التصنيف *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="مثال: نباتي، حار، الأكثر طلباً"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لون الخلفية
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لون النص
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.titleColor}
                  onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.titleColor}
                  onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              معاينة
            </label>
            <div 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: formData.bgColor, 
                color: formData.titleColor 
              }}
            >
              {formData.title || "نص تجريبي"}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جار الحفظ..." : tag ? "تحديث" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Meal Form Modal
const MealModal = ({ isOpen, onClose, meal, onSave, availableTags = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    type: "breakfast",
    isAvailable: true,
    tagIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (meal) {
      setFormData({
        title: meal.title || "",
        description: meal.description || "",
        price: meal.price || "",
        imageUrl: meal.imageUrl || "",
        category: meal.category || "",
        type: meal.type || "breakfast",
        isAvailable: meal.isAvailable !== undefined ? meal.isAvailable : true,
        tagIds: meal.tags ? meal.tags.map(tag => tag.id) : [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        type: "breakfast",
        isAvailable: true,
        tagIds: [],
      });
    }
    setError("");
  }, [meal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      setError("العنوان والوصف والسعر مطلوبة");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (meal) {
        await mealsService.updateMeal(meal.id, submitData);
      } else {
        await mealsService.createMeal(submitData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {meal ? "تعديل الوجبة" : "إضافة وجبة جديدة"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الوجبة *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: كباب الدجاج"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="45.50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="وصف مفصل للوجبة..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                النوع *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="breakfast">فطور</option>
                <option value="lunch">غداء</option>
                <option value="dinner">عشاء</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: مشويات، معجنات"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">متاح للطلب</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رابط الصورة
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيفات
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                      formData.tagIds.includes(tag.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: formData.tagIds.includes(tag.id) 
                        ? tag.bgColor + '20' 
                        : 'transparent',
                      color: formData.tagIds.includes(tag.id) ? tag.bgColor : '#666',
                    }}
                  >
                    {tag.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جار الحفظ...
                </>
              ) : (
                <>
                  <FaSave />
                  {meal ? "تحديث" : "إضافة"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Meals by Tag Modal
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
      await loadMeals(); // Refresh the list
      onRemoveTag?.();
    } catch (err) {
      setError(err.message || "خطأ في إزالة التصنيف");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            الوجبات المصنفة تحت: <span style={{ color: tag?.bgColor }}>{tag?.title}</span>
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
              <div key={meal.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <img
                  src={meal.imageUrl || "/api/placeholder/60/60"}
                  alt={meal.title}
                  className="w-15 h-15 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{meal.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{meal.description}</p>
                  <p className="text-sm font-medium text-green-600">{meal.price} ج.م</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {meal.tags?.map((mealTag) => (
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

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <FaChevronRight />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <FaChevronLeft />
      </button>
    </div>
  );
};

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("tags");
  
  // Tags state
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  
  // Meals state
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState("");
  const [mealSearchTerm, setMealSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,
  });
  const [filters, setFilters] = useState({
    type: "",
    isAvailable: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  
  // Modal states
  const [showTagModal, setShowTagModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showMealsModal, setShowMealsModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const loadTags = useCallback(async () => {
    setTagsLoading(true);
    setTagsError("");
    try {
      const response = await tagsService.getTags();
      if (response.success) {
        setTags(response.data || []);
      }
    } catch (err) {
      setTagsError(err.message || "خطأ في تحميل التصنيفات");
    } finally {
      setTagsLoading(false);
    }
  }, []);

  const loadMeals = useCallback(async (page = 1) => {
    setMealsLoading(true);
    setMealsError("");
    try {
      const params = {
        page,
        pageSize: pagination.pageSize,
        ...filters,
        search: mealSearchTerm || undefined,
      };
      
      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await mealsService.getMeals(params);
      if (response && response.meals) {
        setMeals(response.meals);
        setPagination(prev => ({
          ...prev,
          currentPage: response.pagination?.currentPage || page,
          totalPages: response.pagination?.totalPages || 1,
        }));
      }
    } catch (err) {
      setMealsError(err.message || "خطأ في تحميل الوجبات");
    } finally {
      setMealsLoading(false);
    }
  }, [filters, mealSearchTerm, pagination.pageSize]);

  const filterTags = useCallback(() => {
    if (!tagSearchTerm.trim()) {
      setFilteredTags(tags);
    } else {
      setFilteredTags(
        tags.filter(tag =>
          tag.title.toLowerCase().includes(tagSearchTerm.toLowerCase())
        )
      );
    }
  }, [tags, tagSearchTerm]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  useEffect(() => {
    if (activeTab === "meals") {
      loadMeals();
    }
  }, [loadMeals, activeTab]);

  useEffect(() => {
    filterTags();
  }, [filterTags]);

  const handleDeleteTag = async (tag) => {
    if (!window.confirm(`هل أنت متأكد من حذف التصنيف "${tag.title}"؟`)) return;
    
    try {
      await tagsService.deleteTag(tag.id);
      await loadTags();
    } catch (err) {
      setTagsError(err.message || "خطأ في حذف التصنيف");
    }
  };

  const handleDeleteMeal = async (meal) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوجبة "${meal.title}"؟`)) return;
    
    try {
      await mealsService.deleteMeal(meal.id);
      await loadMeals(pagination.currentPage);
    } catch (err) {
      setMealsError(err.message || "خطأ في حذف الوجبة");
    }
  };

  const handleToggleMealAvailability = async (meal) => {
    try {
      await mealsService.updateMeal(meal.id, { isAvailable: !meal.isAvailable });
      await loadMeals(pagination.currentPage);
    } catch (err) {
      setMealsError(err.message || "خطأ في تحديث حالة الوجبة");
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setShowTagModal(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowMealModal(true);
  };

  const handleViewMeals = (tag) => {
    setSelectedTag(tag);
    setShowMealsModal(true);
  };

  const handleAddNewTag = () => {
    setEditingTag(null);
    setShowTagModal(true);
  };

  const handleAddNewMeal = () => {
    setEditingMeal(null);
    setShowMealModal(true);
  };

  const handlePageChange = (newPage) => {
    loadMeals(newPage);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة قوائم الطعام</h1>
          <p className="text-gray-600">إدارة تصنيفات الوجبات والأطباق</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("tags")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "tags"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaTag className="inline ml-1" />
              إدارة التصنيفات
            </button>
            <button
              onClick={() => setActiveTab("meals")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "meals"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUtensils className="inline ml-1" />
              إدارة الأطباق
            </button>
          </div>
        </div>

        {/* Tags Tab */}
        {activeTab === "tags" && (
          <>
            {tagsError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {tagsError}
              </div>
            )}

            {/* Tags Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="البحث في التصنيفات..."
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <FaFilter className="inline ml-1" />
                  {filteredTags.length} من {tags.length} تصنيف
                </div>
              </div>

              <button
                onClick={handleAddNewTag}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="text-sm" />
                إضافة تصنيف جديد
              </button>
            </div>

            {/* Tags Grid */}
            {tagsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <FaTag className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {tagSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد تصنيفات"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {tagSearchTerm 
                    ? `لم يتم العثور على تصنيفات تحتوي على "${tagSearchTerm}"`
                    : "ابدأ بإضافة تصنيفات جديدة لتنظيم قائمة الطعام"
                  }
                </p>
                {!tagSearchTerm && (
                  <button
                    onClick={handleAddNewTag}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    إضافة أول تصنيف
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTags.map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={handleEditTag}
                    onDelete={handleDeleteTag}
                    onViewMeals={handleViewMeals}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Meals Tab */}
        {activeTab === "meals" && (
          <>
            {mealsError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {mealsError}
              </div>
            )}

            {/* Meals Actions Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="البحث في الأطباق..."
                      value={mealSearchTerm}
                      onChange={(e) => setMealSearchTerm(e.target.value)}
                      className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddNewMeal}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                  إضافة طبق جديد
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={filters.type}
                  onChange={(e) => handleFiltersChange({ type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="breakfast">فطور</option>
                  <option value="lunch">غداء</option>
                  <option value="dinner">عشاء</option>
                </select>

                <select
                  value={filters.isAvailable}
                  onChange={(e) => handleFiltersChange({ isAvailable: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الحالات</option>
                  <option value="true">متاح</option>
                  <option value="false">غير متاح</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFiltersChange({ sortBy: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">تاريخ الإنشاء</option>
                  <option value="title">الاسم</option>
                  <option value="price">السعر</option>
                </select>

                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFiltersChange({ sortOrder: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DESC">تنازلي</option>
                  <option value="ASC">تصاعدي</option>
                </select>
              </div>
            </div>

            {/* Meals Grid */}
            {mealsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-12">
                <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {mealSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد أطباق"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {mealSearchTerm 
                    ? `لم يتم العثور على أطباق تحتوي على "${mealSearchTerm}"`
                    : "ابدأ بإضافة أطباق جديدة إلى قائمة الطعام"
                  }
                </p>
                {!mealSearchTerm && (
                  <button
                    onClick={handleAddNewMeal}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    إضافة أول طبق
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onEdit={handleEditMeal}
                      onDelete={handleDeleteMeal}
                      onToggleAvailability={handleToggleMealAvailability}
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}

        {/* Modals */}
        <TagModal
          isOpen={showTagModal}
          onClose={() => setShowTagModal(false)}
          tag={editingTag}
          onSave={loadTags}
        />

        <MealModal
          isOpen={showMealModal}
          onClose={() => setShowMealModal(false)}
          meal={editingMeal}
          onSave={() => loadMeals(pagination.currentPage)}
          availableTags={tags}
        />

        <MealsByTagModal
          isOpen={showMealsModal}
          onClose={() => setShowMealsModal(false)}
          tag={selectedTag}
          onRemoveTag={loadTags}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuManagement;