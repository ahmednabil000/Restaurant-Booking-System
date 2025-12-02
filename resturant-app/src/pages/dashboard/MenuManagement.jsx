import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaTag,
  FaUtensils,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as tagsService from "../../services/tagsService";
import * as mealsService from "../../services/mealsService";

// Import extracted components
import TagCard from "../../components/dashboard/menu/TagCard";
import MealCard from "../../components/dashboard/menu/MealCard";
import TagModal from "../../components/dashboard/menu/TagModal";
import MealModal from "../../components/dashboard/menu/MealModal";
import MealsByTagModal from "../../components/dashboard/menu/MealsByTagModal";
import Pagination from "../../components/dashboard/menu/Pagination";

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