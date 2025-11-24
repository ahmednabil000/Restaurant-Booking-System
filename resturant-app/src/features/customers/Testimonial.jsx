import StaticStarRating from "../../ui/StaticStarRating";

function Testimonial({
  rating = 5,
  comment = "تعليق رائع",
  name = "العميل",
  avatar,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-5 h-auto min-h-56 md:min-h-64 flex flex-col justify-between border border-gray-100 hover:border-orange-200 group">
      {/* Quote Icon */}
      <div className="mb-3">
        <svg
          className="w-6 h-6 text-orange-400 opacity-60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 18L14.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847zM1.017 18L1.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847z" />
        </svg>
      </div>

      {/* Comment */}
      <div className="flex-1 mb-4 min-h-16 max-h-16">
        <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed italic text-center line-clamp-3">
          "{comment}"
        </p>
      </div>

      {/* Rating */}
      <div className="mb-4 flex justify-center">
        <StaticStarRating rating={rating} />
      </div>

      {/* User Info */}
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-300 transition-colors duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-base ${
              avatar ? "hidden" : "flex"
            }`}
          >
            {name.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm md:text-base lg:text-lg">
            {name}
          </h4>
          <p className="text-sm text-gray-500">عميل مميز</p>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
