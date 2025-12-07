import StaticStarRating from "../../ui/StaticStarRating";

function Testimonial({ rating = 5, comment = "تعليق رائع", name = "العميل" }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 h-auto min-h-64 md:min-h-72 flex flex-col border border-gray-100 hover:border-[#e26136] group overflow-hidden">
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-[#e26136] to-[#cd4f25] opacity-10 rounded-bl-full"></div>

      {/* Quote Icon - Larger and more prominent */}
      <div className="mb-6 relative z-10">
        <svg
          className="w-10 h-10 md:w-12 md:h-12 text-[#e26136] opacity-30 group-hover:opacity-50 transition-opacity duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 18L14.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847zM1.017 18L1.017 10.609c0-.402.356-.847.736-.847h3.462c.379 0 .736.175.736.847v8.91c0 .402-.357.847-.736.847h-3.462c-.38 0-.736-.175-.736-.847z" />
        </svg>
      </div>

      {/* Comment - More spacious */}
      <div className="flex-1 mb-6">
        <p className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed text-center font-medium">
          "{comment}"
        </p>
      </div>

      {/* Rating - Enhanced styling */}
      <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
        <StaticStarRating rating={rating} />
      </div>

      {/* Divider */}
      <div className="w-16 h-1 bg-linear-to-r from-transparent via-[#e26136] to-transparent mx-auto mb-6"></div>

      {/* User Info - Centered without image */}
      <div className="flex flex-col items-center gap-3">
        {/* Initial Circle - Larger and more stylish */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-[#e26136] to-[#cd4f25] flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          {name.charAt(0)}
        </div>

        {/* Name and title */}
        <div className="text-center">
          <h4 className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-1">
            {name}
          </h4>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
            <svg
              className="w-4 h-4 text-[#e26136]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-[#e26136]">
              عميل مميز
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
