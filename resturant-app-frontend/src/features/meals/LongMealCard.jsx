// src/components/MealCard.jsx
import React from "react";
import { FaHeart } from "react-icons/fa";
import AddToCartButton from "../../components/AddToCartButton";
import { getFullImageUrl } from "../../services/mealsService";

const LongMealCard = ({ item, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) onToggleFavorite(item.id, !isFavorite);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <div className="relative overflow-hidden h-48 shrink-0">
        <img
          src={
            getFullImageUrl(item.imageUrl) ||
            getFullImageUrl(item.image) ||
            item.image
          }
          alt={item.name}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            isFavorite
              ? "text-red-500 bg-white/95 shadow-red-200"
              : "text-gray-500 bg-white/90 hover:bg-white"
          }`}
        >
          <FaHeart size={16} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex-1 mr-3 group-hover:text-[#e26136] transition-colors duration-300 line-clamp-2">
            {item.name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-[#e26136] font-bold text-xl whitespace-nowrap block">
              {item.price.toFixed(2)} ج.م
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed grow">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-8">
          {item.tags.slice(0, 3).map((tag, index) => {
            // Handle both string tags and object tags
            const tagName =
              typeof tag === "string" ? tag : tag.title || tag.name || "";
            const tagId = typeof tag === "object" && tag.id ? tag.id : index;
            const bgColor = typeof tag === "object" ? tag.bgColor : null;
            const titleColor = typeof tag === "object" ? tag.titleColor : null;

            // Use custom colors if available, otherwise use predefined classes
            const customStyle =
              bgColor && titleColor
                ? {
                    backgroundColor: bgColor,
                    color: titleColor,
                  }
                : {};

            const defaultClasses =
              bgColor && titleColor
                ? ""
                : tagName === "نباتي"
                ? "bg-green-100 text-green-800"
                : tagName === "حار"
                ? "bg-red-100 text-red-800"
                : tagName === "خالي من الغلوتين"
                ? "bg-yellow-100 text-yellow-800"
                : tagName === "الأكثر طلباً"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800";

            return (
              <span
                key={tagId}
                style={customStyle}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium ${defaultClasses} transition-all duration-200 hover:shadow-sm`}
              >
                {tagName}
              </span>
            );
          })}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <AddToCartButton
            item={item}
            className="w-full font-semibold py-3 px-4 text-base rounded-xl transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default LongMealCard;
