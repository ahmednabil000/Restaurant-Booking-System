import React from "react";
import { FaFire, FaSpinner } from "react-icons/fa";
import { useTopDemandedMealsQuery } from "../../hooks/useMeals";
import { getFullImageUrl } from "../../services/mealsService";
import HomeMealCard from "../../components/HomeMealCard";

const TopDemandedMeals = () => {
  const { data: topMealsData, isLoading, error } = useTopDemandedMealsQuery(3);

  // Extract meals and metadata from the response
  const topMeals = topMealsData?.meals || [];
  const period = topMealsData?.period;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 text-[#e26136]">
          <FaSpinner className="animate-spin text-xl" />
          <span className="text-lg">جاري تحميل الأطباق الأكثر طلباً...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-4 sm:px-6 md:px-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-80 w-full max-w-sm bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("Error loading top demanded meals:", error);
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <FaFire className="mx-auto text-4xl mb-2 opacity-50" />
          <p className="text-lg font-semibold">
            عذراً، حدث خطأ في تحميل الأطباق
          </p>
          <p className="text-sm text-gray-600 mt-1">
            يرجى المحاولة مرة أخرى لاحقاً
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!topMeals || topMeals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <FaFire className="mx-auto text-4xl mb-2 opacity-30" />
          <p className="text-lg font-semibold">لا توجد أطباق متاحة حالياً</p>
          <p className="text-sm text-gray-400 mt-1">
            تابعونا قريباً للمزيد من الأطباق الشهية
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 text-[#e26136] mb-2">
          <FaFire className="text-2xl animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            الأطباق الأكثر طلباً
          </h2>
          <FaFire className="text-2xl animate-pulse" />
        </div>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
          {period
            ? `أكثر الأطباق شعبية في ${period.monthName} ${period.year}`
            : "اكتشف أكثر الأطباق شعبية في مطعمنا والتي يفضلها عملاؤنا"}
        </p>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-4 sm:px-6 md:px-8">
        {topMeals.map((meal) => {
          // Transform API meal data to match component expectations
          const transformedMeal = {
            id: meal.id,
            name: meal.title || meal.name,
            title: meal.title || meal.name,
            price: parseFloat(meal.price),
            originalPrice: meal.originalPrice
              ? parseFloat(meal.originalPrice)
              : null,
            imageUrl:
              getFullImageUrl(meal.imageUrl) ||
              getFullImageUrl(meal.image) ||
              meal.imageUrl ||
              meal.image,
            description: meal.description,
            ingredients: meal.ingredients || [],
            tags: meal.tags || [],
            category: meal.category,
            type: meal.type,
            isAvailable: meal.isAvailable,
            rating: meal.rating || meal.averageRating,
            reviewCount: meal.reviewCount || meal.totalReviews,
            preparationTime: meal.preparationTime || meal.prepTime,
            totalDemand: meal.totalDemand, // Total demand count
            orderCount: meal.orderCount, // Number of orders
            demandCount: meal.totalDemand || meal.orderCount, // For compatibility
          };

          return (
            <HomeMealCard
              key={meal.id}
              item={transformedMeal}
              isDemanded={true}
            />
          );
        })}
      </div>

      {/* View More Button */}
      <div className="text-center pt-4">
        <a
          href="/menu"
          className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>استكشف المزيد من الأطباق</span>
          <FaFire className="text-sm" />
        </a>
      </div>
    </div>
  );
};

export default TopDemandedMeals;
