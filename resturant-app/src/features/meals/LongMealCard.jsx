// src/components/MealCard.jsx
import React from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const LongMealCard = ({ item, onAddToCart, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) onToggleFavorite(item.id, !isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? "text-red-500 bg-red-50" : "text-gray-400 bg-white"
          } transition-colors`}
        >
          <FaHeart size={18} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1 mr-2">
            {item.name}
          </h3>
          <span className="text-orange-600 font-bold text-xl sm:text-2xl whitespace-nowrap">
            {item.price.toFixed(2)} ج.م
          </span>
        </div>

        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-4 min-h-16 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-base sm:text-lg rounded-full ${
                tag === "نباتي"
                  ? "bg-green-100 text-green-800"
                  : tag === "حار"
                  ? "bg-red-100 text-red-800"
                  : tag === "خالي من الغلوتين"
                  ? "bg-yellow-100 text-yellow-800"
                  : tag === "الأكثر طلباً"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(item)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg sm:text-xl"
        >
          <FaShoppingCart size={16} />
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
};

export default LongMealCard;
