import StaticStarRating from "../../ui/StaticStarRating";

function Testimonial({
  rating = 5,
  comment = "تعليق رائع",
  name = "العميل",
  avatar,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 h-auto min-h-70 md:min-h-80 flex flex-col justify-between border border-gray-100 hover:border-orange-200 group">
      {/* Quote Icon */}
      <div className="mb-4">
        <svg
          className="w-8 h-8 text-orange-400 opacity-60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 18L14.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847zM1.017 18L1.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847z" />
        </svg>
      </div>

      {/* Comment */}
      <div className="flex-1 mb-6">
        <p className="text-gray-700 text-base md:text-lg leading-relaxed italic text-center line-clamp-4">
          "{comment}"
        </p>
      </div>

      {/* Rating */}
      <div className="mb-6 flex justify-center">
        <StaticStarRating rating={rating} />
      </div>

      {/* User Info */}
      <div className="flex items-center justify-center gap-4">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-300 transition-colors duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg ${
              avatar ? "hidden" : "flex"
            }`}
          >
            {name.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-base md:text-lg">
            {name}
          </h4>
          <p className="text-sm text-gray-500">عميل مميز</p>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
