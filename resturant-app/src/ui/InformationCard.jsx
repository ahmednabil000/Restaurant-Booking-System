const InformationCard = ({ children, title, content }) => {
  return (
    <button className="flex cursor-pointer flex-col gap-4 sm:gap-6 border-2 border-gray-400/10 p-4 sm:p-6 md:p-8 rounded-lg justify-center items-center w-full h-full min-h-48 sm:min-h-56 md:min-h-64 hover:shadow-lg transition-shadow duration-200">
      <div className="shrink-0">{children}</div>
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
        {title}
      </span>
      <p className="text-sm sm:text-base md:text-[1.4rem] text-[#565d6d] text-center leading-relaxed">
        {content}
      </p>
    </button>
  );
};

export default InformationCard;
