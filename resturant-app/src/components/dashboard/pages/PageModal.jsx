import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import * as pagesService from "../../../services/pagesService";

const PageModal = ({ isOpen, onClose, page, onSave }) => {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    heroImage: "",
    content: "",
    featuredItems: [],
    featuredReviews: [],
    chefs: [],
    meta: { seoTitle: "", description: "" },
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug || "",
        title: page.title || "",
        heroImage: page.heroImage || "",
        content: page.content || "",
        featuredItems: page.featuredItems || [],
        featuredReviews: page.featuredReviews || [],
        chefs: page.chefs || [],
        meta: page.meta || { seoTitle: "", description: "" },
        isActive: page.isActive !== undefined ? page.isActive : true,
      });
    } else {
      setFormData({
        slug: "",
        title: "",
        heroImage: "",
        content: "",
        featuredItems: [],
        featuredReviews: [],
        chefs: [],
        meta: { seoTitle: "", description: "" },
        isActive: true,
      });
    }
    setError("");
    setActiveSection("basic");
  }, [page, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.title.trim()) {
      setError("الرابط والعنوان مطلوبان");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      if (page) {
        response = await pagesService.updatePage(page.id, formData);
      } else {
        response = await pagesService.createPage(formData);
      }

      if (response.success) {
        onSave();
        onClose();
      } else {
        setError(response.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const addFeaturedItem = () => {
    setFormData((prev) => ({
      ...prev,
      featuredItems: [
        ...prev.featuredItems,
        { mealId: "", order: prev.featuredItems.length + 1 },
      ],
    }));
  };

  const removeFeaturedItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      featuredItems: prev.featuredItems.filter((_, i) => i !== index),
    }));
  };

  const updateFeaturedItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      featuredItems: prev.featuredItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addFeaturedReview = () => {
    setFormData((prev) => ({
      ...prev,
      featuredReviews: [
        ...prev.featuredReviews,
        { author: "", text: "", rating: 5 },
      ],
    }));
  };

  const removeFeaturedReview = (index) => {
    setFormData((prev) => ({
      ...prev,
      featuredReviews: prev.featuredReviews.filter((_, i) => i !== index),
    }));
  };

  const updateFeaturedReview = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      featuredReviews: prev.featuredReviews.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addChef = () => {
    setFormData((prev) => ({
      ...prev,
      chefs: [...prev.chefs, { name: "", bio: "", photo: "" }],
    }));
  };

  const removeChef = (index) => {
    setFormData((prev) => ({
      ...prev,
      chefs: prev.chefs.filter((_, i) => i !== index),
    }));
  };

  const updateChef = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      chefs: prev.chefs.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {page ? "تعديل الصفحة" : "إضافة صفحة جديدة"}
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

        {/* Section Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {["basic", "content", "featured", "meta"].map((section) => {
              const labels = {
                basic: "المعلومات الأساسية",
                content: "المحتوى",
                featured: "المحتوى المميز",
                meta: "بيانات SEO",
              };
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeSection === section
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {labels[section]}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الرابب (slug) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="home, about-us"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان الصفحة *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الرئيسية"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صورة البطل
                </label>
                <input
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) =>
                    setFormData({ ...formData, heroImage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/hero.jpg"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    الصفحة نشطة
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Content */}
          {activeSection === "content" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                محتوى الصفحة
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="15"
                placeholder="محتوى HTML أو نص عادي..."
              />
            </div>
          )}

          {/* Featured Content */}
          {activeSection === "featured" && (
            <div className="space-y-6">
              {/* Featured Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">العناصر المميزة</h4>
                  <button
                    type="button"
                    onClick={addFeaturedItem}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-xs" />
                    إضافة
                  </button>
                </div>
                {formData.featuredItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="معرف الوجبة"
                      value={item.mealId}
                      onChange={(e) =>
                        updateFeaturedItem(index, "mealId", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="الترتيب"
                      value={item.order}
                      onChange={(e) =>
                        updateFeaturedItem(
                          index,
                          "order",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeaturedItem(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Featured Reviews */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    التقييمات المميزة
                  </h4>
                  <button
                    type="button"
                    onClick={addFeaturedReview}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-xs" />
                    إضافة
                  </button>
                </div>
                {formData.featuredReviews.map((review, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="اسم المؤلف"
                        value={review.author}
                        onChange={(e) =>
                          updateFeaturedReview(index, "author", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={review.rating}
                        onChange={(e) =>
                          updateFeaturedReview(
                            index,
                            "rating",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFeaturedReview(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                    <textarea
                      placeholder="نص التقييم"
                      value={review.text}
                      onChange={(e) =>
                        updateFeaturedReview(index, "text", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                ))}
              </div>

              {/* Chefs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">الطهاة</h4>
                  <button
                    type="button"
                    onClick={addChef}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-xs" />
                    إضافة
                  </button>
                </div>
                {formData.chefs.map((chef, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="اسم الطاهي"
                        value={chef.name}
                        onChange={(e) =>
                          updateChef(index, "name", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="url"
                        placeholder="رابط الصورة"
                        value={chef.photo}
                        onChange={(e) =>
                          updateChef(index, "photo", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeChef(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                    <textarea
                      placeholder="نبذة عن الطاهي"
                      value={chef.bio}
                      onChange={(e) => updateChef(index, "bio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Information */}
          {activeSection === "meta" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان SEO
                </label>
                <input
                  type="text"
                  value={formData.meta.seoTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, seoTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="عنوان محرك البحث"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف SEO
                </label>
                <textarea
                  value={formData.meta.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta: { ...formData.meta, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="وصف الصفحة لمحركات البحث"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جار الحفظ...
                </>
              ) : (
                <>
                  <FaSave />
                  {page ? "تحديث" : "إضافة"}
                </>
              )}
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

export default PageModal;
