import burger from "../../assets/burger.jpg";
const MealCard = ({ description }) => {
  return (
    <div className="h-auto min-h-120 sm:min-h-140 md:min-h-152 lg:h-[40.9rem] w-full max-w-sm sm:max-w-md lg:max-w-152 justify-between rounded-xl border-2 border-gray-400/50 flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 hover:shadow-lg transition-shadow duration-200">
      <img
        src={burger}
        alt="meal"
        className="h-48 sm:h-56 md:h-64 lg:h-[19.2rem] w-full object-cover rounded-xl sm:rounded-2xl"
      />
      <span className="text-lg sm:text-xl md:text-2xl lg:text-[2.4rem] font-semibold">
        #Title
      </span>
      <p className="text-sm sm:text-base lg:text-[1.4rem] min-h-16 sm:min-h-20 lg:min-h-[6.8rem] text-[#565d6d] line-clamp-3 leading-relaxed">
        {description}
      </p>
      <span className="text-[#e26136] text-base sm:text-lg md:text-xl lg:text-[1.8rem] font-bold">
        120 ج.م
      </span>
    </div>
  );
};

export default MealCard;
