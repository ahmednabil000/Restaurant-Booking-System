// src/components/MenuPage.jsx
import React, { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import MealCard from "../features/meals/LongMealCard";
import FilterChips from "../features/meals/MealFilterChips";
import { menuItems, categories, filters } from "../data/menuData";
import menuPageImg from "../assets/menu-page-meal.jpg";
import Seperator from "../ui/Seperator";
import Container from "../ui/Container";
const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Calculate filtered items using useMemo to avoid cascading renders
  const filteredItems = useMemo(() => {
    let results = menuItems;

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(term))
      );
    }

    // Filter by tags
    if (selectedFilters.length > 0) {
      results = results.filter((item) =>
        selectedFilters.every((filterId) => {
          const tagMap = {
            vegetarian: "نباتي",
            spicy: "حار",
            glutenFree: "خالي من الغلوتين",
            mostPopular: "الأكثر طلباً",
          };
          return item.tags.includes(tagMap[filterId]);
        })
      );
    }

    return results;
  }, [searchTerm, selectedCategory, selectedFilters]);

  const handleToggleFavorite = (itemId, isFavorite) => {
    console.log(`Item ${itemId} favorite status: ${isFavorite}`);
    // Update favorite state in context/redux if needed
  };

  return (
    <>
      <div className="h-[40rem] w-full relative">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-6 gap-2 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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
          onFilterChange={setSelectedFilters}
        />

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MealCard
                key={item.id}
                item={item}
                onToggleFavorite={handleToggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 text-lg sm:text-xl">
              لا يوجد أطباق مطابقة لبحثك.
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default MenuPage;
