import burger from "../../assets/burger.jpg";
import AddToCartButton from "../../components/AddToCartButton";

const ShortMealCard = ({ item, description }) => {
  return (
    <div className="h-auto min-h-80 sm:min-h-96 md:min-h-100 lg:h-[28rem] w-full max-w-sm sm:max-w-md lg:max-w-lg justify-between rounded-xl border-2 border-gray-400/50 flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow duration-200">
      <img
        src={item?.image || burger}
        alt={item?.name || "meal"}
        className="h-36 sm:h-40 md:h-44 lg:h-48 w-full object-cover rounded-xl"
      />
      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
        {item?.name || "#Title"}
      </span>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg min-h-12 sm:min-h-14 lg:min-h-16 text-[#565d6d] line-clamp-3 leading-relaxed">
        {item?.description || description}
      </p>
      <div className="mt-auto space-y-2">
        <span className="text-[#e26136] text-sm sm:text-base md:text-lg lg:text-xl font-bold">
          {item?.price ? `${item.price.toFixed(2)} ج.م` : "120 ج.م"}
        </span>
        {item && (
          <AddToCartButton item={item} className="w-full py-2 px-3 text-sm" />
        )}
      </div>
    </div>
  );
};

export default ShortMealCard;
