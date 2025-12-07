import React from "react";
import { FaStar, FaHeart, FaShoppingCart, FaFire } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import AddToCartButton from "./AddToCartButton";
import { getFullImageUrl } from "../services/mealsService";
import burger from "../assets/burger.jpg";

const HomeMealCard = ({ item, isDemanded = false }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Calculate discount percentage if there's an original price
  const hasDiscount = item?.originalPrice && item?.originalPrice > item?.price;
  const discountPercentage = hasDiscount
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative h-auto w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={
            getFullImageUrl(item?.imageUrl) ||
            getFullImageUrl(item?.image) ||
            item?.image ||
            burger
          }
          alt={item?.title || item?.name || "meal"}
          className="h-48 sm:h-52 w-full object-cover transition-all duration-500"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Demand badge */}
          {isDemanded && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              <FaFire className="text-xs" />
              <span>الأكثر طلباً</span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              خصم {discountPercentage}%
            </div>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
        >
          {isWishlisted ? (
            <AiFillHeart className="text-red-500 text-lg" />
          ) : (
            <AiOutlineHeart className="text-gray-600 text-lg" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#e26136] transition-colors duration-200">
            {item?.title || item?.name || "اسم الطبق"}
          </h3>

          {/* Rating */}
          {item?.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`text-xs ${
                      index < Math.floor(item.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({item.rating?.toFixed(1)})
              </span>
              {item?.reviewCount && (
                <span className="text-xs text-gray-500">
                  • {item.reviewCount} تقييم
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {item?.description ||
            "وصف شهي لهذا الطبق الرائع المحضر بأجود المكونات"}
        </p>

        {/* Tags */}
        {item?.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {typeof tag === "string"
                  ? tag
                  : tag.name || tag.title || "تصنيف"}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#e26136]">
                {item?.price ? `${Number(item.price).toFixed(2)}` : "120.00"}{" "}
                ج.م
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {Number(item.originalPrice).toFixed(2)} ج.م
                </span>
              )}
            </div>
            {item?.preparationTime && (
              <p className="text-xs text-gray-500">
                وقت التحضير: {item.preparationTime} دقيقة
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          {item && (
            <div className="shrink-0">
              <AddToCartButton
                item={item}
                className="px-3 py-2 text-sm font-semibold bg-[#e26136] text-white rounded-xl hover:bg-[#cd4f25] transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1"
              >
                <FaShoppingCart className="text-xs" />
                <span className="hidden sm:inline">إضافة</span>
              </AddToCartButton>
            </div>
          )}
        </div>

        {/* Demand indicator */}
        {isDemanded && (
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-2 text-xs text-orange-600 font-medium">
              <FaFire className="text-orange-500" />
              <span>
                {item?.totalDemand
                  ? `طلبه ${item.totalDemand} عميل هذا الشهر`
                  : "يطلبه العديد من العملاء"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeMealCard;
