import { Rating, RatingButton } from "../components/ui/shadcn-io/rating";

function StaticStarRating({ rating }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Rating value={rating} readOnly className="text-yellow-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton
            className={`text-lg md:text-xl transition-colors duration-200 ${
              index < rating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300"
            }`}
            key={index}
          />
        ))}
      </Rating>
    </div>
  );
}

export default StaticStarRating;
