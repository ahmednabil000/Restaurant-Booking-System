import { Link } from "react-router";

const InformationCard = ({ children, title, content }) => {
  return (
    <Link
      to={"/reserve"}
      className="flex cursor-pointer flex-col gap-3 sm:gap-4 border-2 border-gray-400/10 p-3 sm:p-4 md:p-6 rounded-lg justify-center items-center w-full h-full min-h-40 sm:min-h-44 md:min-h-48 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="shrink-0">{children}</div>
      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
        {title}
      </span>
      <p className="text-sm sm:text-base md:text-lg text-[#565d6d] text-center leading-relaxed">
        {content}
      </p>
    </Link>
  );
};

export default InformationCard;
