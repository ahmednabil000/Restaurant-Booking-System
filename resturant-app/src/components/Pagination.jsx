import React from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  className = "",
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`p-2 rounded-lg border transition-colors duration-200 ${
          hasPrevPage
            ? "border-gray-300 hover:border-[#e26136] hover:bg-orange-50 text-gray-700"
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Previous page"
      >
        <AiOutlineRight className="text-lg" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] h-10 rounded-lg border transition-colors duration-200 ${
                  currentPage === page
                    ? "border-[#e26136] bg-[#e26136] text-white"
                    : "border-gray-300 hover:border-[#e26136] hover:bg-orange-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`p-2 rounded-lg border transition-colors duration-200 ${
          hasNextPage
            ? "border-gray-300 hover:border-[#e26136] hover:bg-orange-50 text-gray-700"
            : "border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Next page"
      >
        <AiOutlineLeft className="text-lg" />
      </button>
    </div>
  );
};

export default Pagination;
