import React from "react";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaImage,
  FaEye,
} from "react-icons/fa";

const PageCard = ({ page, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive) => {
    return isActive ? "نشطة" : "غير نشطة";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800 truncate">
              {page.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                page.isActive
              )}`}
            >
              {getStatusText(page.isActive)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">/{page.slug}</p>
          {page.heroImage && (
            <div className="mb-3">
              <img
                src={page.heroImage}
                alt={page.title}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/api/placeholder/300/200";
                }}
              />
            </div>
          )}
          {page.content && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {page.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          آخر تحديث: {new Date(page.updatedAt).toLocaleDateString("ar-SA")}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStatus(page)}
            className={`p-2 rounded ${
              page.isActive
                ? "text-green-600 hover:bg-green-50"
                : "text-red-600 hover:bg-red-50"
            }`}
            title={page.isActive ? "إلغاء التفعيل" : "تفعيل"}
          >
            {page.isActive ? <FaToggleOn /> : <FaToggleOff />}
          </button>

          <button
            onClick={() => window.open(`/pages/${page.slug}`, "_blank")}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="معاينة"
          >
            <FaEye className="text-sm" />
          </button>

          <button
            onClick={() => onEdit(page)}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
            title="تعديل"
          >
            <FaEdit className="text-sm" />
          </button>

          <button
            onClick={() => onDelete(page)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="حذف"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 text-xs">
          {page.featuredItems && page.featuredItems.length > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {page.featuredItems.length} عنصر مميز
            </span>
          )}
          {page.featuredReviews && page.featuredReviews.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              {page.featuredReviews.length} تقييم مميز
            </span>
          )}
          {page.chefs && page.chefs.length > 0 && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {page.chefs.length} طاهي
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageCard;
