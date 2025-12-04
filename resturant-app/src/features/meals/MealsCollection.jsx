import React from "react";
import ShortMealCard from "./ShortMealCard";
import { useMealsQuery } from "../../hooks/useMeals";
import { getFullImageUrl } from "../../services/mealsService";

const MealsCollection = ({ meals: propMeals, maxItems = 4 }) => {
  // Use API data if no meals are passed as props
  const { data: mealsData, isLoading } = useMealsQuery({
    page: 1,
    pageSize: maxItems,
    isAvailable: true,
  });

  const meals = propMeals || mealsData?.meals || [];
  const displayMeals = meals.slice(0, maxItems);

  if (isLoading && !propMeals) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center justify-items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-6 md:px-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-80 w-full max-w-sm bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center justify-items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-6 md:px-8">
      {displayMeals.map((meal) => {
        // Transform API meal data to match component expectations
        const transformedMeal = {
          id: meal.id,
          name: meal.title || meal.name,
          price: parseFloat(meal.price),
          image:
            getFullImageUrl(meal.imageUrl) ||
            getFullImageUrl(meal.image) ||
            `https://via.placeholder.com/300x200?text=${encodeURIComponent(
              meal.title || meal.name
            )}`,
          description: meal.description,
          ingredients: meal.ingredients || [],
          tags: meal.tags || [],
          category: meal.category,
        };

        return <ShortMealCard key={meal.id} item={transformedMeal} />;
      })}
    </div>
  );
};

export default MealsCollection;
