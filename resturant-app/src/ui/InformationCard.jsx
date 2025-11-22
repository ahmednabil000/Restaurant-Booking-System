import { Link } from "react-router";

const InformationCard = ({ children, title, content }) => {
  return (
    <Link
      to={"/reserve"}
      className="flex cursor-pointer flex-col gap-4 sm:gap-6 border-2 border-gray-400/10 p-4 sm:p-6 md:p-8 rounded-lg justify-center items-center w-full h-full min-h-48 sm:min-h-56 md:min-h-64 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="shrink-0">{children}</div>
      <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-center">
        {title}
      </span>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#565d6d] text-center leading-relaxed">
        {content}
      </p>
    </Link>
  );
};

export default InformationCard;
