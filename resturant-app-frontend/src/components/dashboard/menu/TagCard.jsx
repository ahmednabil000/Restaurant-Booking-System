import React from "react";
import { FaEdit, FaTrash, FaEye, FaPalette } from "react-icons/fa";

const TagCard = ({ tag, onEdit, onDelete, onViewMeals }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: tag.bgColor || "#007bff",
          color: tag.titleColor || "#fff",
        }}
      >
        {tag.title}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewMeals(tag)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="عرض الوجبات"
        >
          <FaEye className="text-sm" />
        </button>
        <button
          onClick={() => onEdit(tag)}
          className="p-1 text-orange-600 hover:bg-orange-50 rounded"
          title="تعديل"
        >
          <FaEdit className="text-sm" />
        </button>
        <button
          onClick={() => onDelete(tag)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="حذف"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaPalette className="text-xs" />
      <span>الخلفية: {tag.bgColor || "#007bff"}</span>
      <span>النص: {tag.titleColor || "#fff"}</span>
    </div>
  </div>
);

export default TagCard;
