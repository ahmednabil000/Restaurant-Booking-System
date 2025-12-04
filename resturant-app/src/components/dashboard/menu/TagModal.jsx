import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import * as tagsService from "../../../services/tagsService";

const TagModal = ({ isOpen, onClose, tag, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    titleColor: "#ffffff",
    bgColor: "#007bff",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tag) {
      setFormData({
        title: tag.title || "",
        titleColor: tag.titleColor || "#ffffff",
        bgColor: tag.bgColor || "#007bff",
      });
    } else {
      setFormData({
        title: "",
        titleColor: "#ffffff",
        bgColor: "#007bff",
      });
    }
    setError("");
  }, [tag, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("عنوان التصنيف مطلوب");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (tag) {
        await tagsService.updateTag(tag.id, formData);
      } else {
        await tagsService.createTag(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {tag ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان التصنيف *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="مثال: نباتي، حار، الأكثر طلباً"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لون الخلفية
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgColor: e.target.value })
                  }
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgColor: e.target.value })
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لون النص
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.titleColor}
                  onChange={(e) =>
                    setFormData({ ...formData, titleColor: e.target.value })
                  }
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.titleColor}
                  onChange={(e) =>
                    setFormData({ ...formData, titleColor: e.target.value })
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              معاينة
            </label>
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: formData.bgColor,
                color: formData.titleColor,
              }}
            >
              {formData.title || "نص تجريبي"}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جار الحفظ..." : tag ? "تحديث" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TagModal;
