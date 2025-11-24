import React from "react";
import ShortMealCard from "./ShortMealCard";
import { menuItems } from "../../data/menuData";

const MealsCollection = ({ meals = menuItems.slice(0, 4) }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center justify-items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-6 md:px-8">
      {meals.map((meal) => (
        <ShortMealCard key={meal.id} item={meal} />
      ))}
    </div>
  );
};

export default MealsCollection;
