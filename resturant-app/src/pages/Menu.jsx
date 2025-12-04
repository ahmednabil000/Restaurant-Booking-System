// src/components/MenuPage.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import MealCard from "../features/meals/LongMealCard";
import FilterChips from "../features/meals/MealFilterChips";
import { useMealsQuery } from "../hooks/useMeals";
import { getFullImageUrl } from "../services/mealsService";
import Pagination from "../components/Pagination";
import menuPageImg from "../assets/menu-page-meal.jpg";
import Seperator from "../ui/Seperator";
import Container from "../ui/Container";
const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Map filter tags to API parameters
  const getTypeFromCategory = (category) => {
    const categoryMap = {
      المقبلات: "غذاء",
      "الأطباق الرئيسية": "غذاء",
      المشاوي: "عشاء",
      "الوجبات السريعة": "غذاء",
      الحلويات: "عشاء",
    };
    return categoryMap[category] || undefined;
  };

  // Fetch meals data
  const {
    data: mealsData,
    isLoading,
    error,
    isFetching,
  } = useMealsQuery({
    page: currentPage,
    pageSize,
    category: selectedCategory || undefined,
    search: searchTerm || undefined,
    type: getTypeFromCategory(selectedCategory),
    isAvailable: true,
    tags: selectedFilters.length > 0 ? selectedFilters : undefined,
  });

  const meals = mealsData?.meals || [];
  const pagination = mealsData?.pagination || {};

  // Get unique categories from the API data
  const categories = [
    { id: "", name: "الكل" },
    { id: "المقبلات", name: "المقبلات" },
    { id: "الأطباق الرئيسية", name: "الأطباق الرئيسية" },
    { id: "المشاوي", name: "المشاوي" },
    { id: "الوجبات السريعة", name: "الوجبات السريعة" },
    { id: "الحلويات", name: "الحلويات" },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedFilters([]); // Reset filters when category changes
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFiltersChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to meals section instead of top of page
    const mealsSection = document.querySelector(".grid");
    if (mealsSection) {
      mealsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggleFavorite = (itemId, isFavorite) => {
    console.log(`Item ${itemId} favorite status: ${isFavorite}`);
    // Update favorite state in context/redux if needed
  };

  return (
    <>
      <div className="h-160 w-full relative">
        <img src={menuPageImg} className="object-cover w-full h-full" />
        <div className="bg-black/30 w-full h-full absolute top-0 "></div>
        <p className="absolute top-[50%] left-[50%] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl translate-[-50%] text-white font-bold">
          قائمة طعامنا الشهية
          <br></br>
          <span className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl">
            استكشف مجموعتنا الواسعة من الأطباق التقليدية والعالمية، المحضرة
            بعناية من أجود المكونات الطازجة.
          </span>
        </p>
      </div>
      <Seperator />
      {/* Search Bar */}
      <Container>
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن طبقك المفضل..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-6 gap-2 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-base sm:text-lg ${
                selectedCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        <FilterChips
          selectedFilters={selectedFilters}
          onFilterChange={handleFiltersChange}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136] mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الوجبات...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                خطأ في تحميل البيانات
              </h3>
              <p className="text-red-600 mb-4">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Meals Grid */}
        {!isLoading && !error && (
          <>
            {meals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 auto-rows-fr">
                  {meals.map((meal) => {
                    // Transform API meal data to match component expectations
                    const transformedMeal = {
                      id: meal.id,
                      name: meal.title,
                      price: parseFloat(meal.price),
                      imageUrl: meal.imageUrl,
                      image:
                        getFullImageUrl(meal.imageUrl) ||
                        `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                          meal.title
                        )}`,
                      description: meal.description,
                      ingredients: [],
                      tags: Array.isArray(meal.tags) ? meal.tags : [],
                      category: meal.category,
                    };

                    return (
                      <MealCard
                        key={meal.id}
                        item={transformedMeal}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 text-lg sm:text-xl">
                لا يوجد أطباق مطابقة لبحثك.
              </div>
            )}
          </>
        )}

        {/* Loading overlay for page changes */}
        {isFetching && !isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136] mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحديث النتائج...</p>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default MenuPage;
