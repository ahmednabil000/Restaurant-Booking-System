import React, { useState } from "react";
import {
  FaStore,
  FaPhone,
  FaClock,
  FaTable,
  FaCog,
  FaSave,
  FaEdit,
  FaInfoCircle,
  FaShareAlt,
} from "react-icons/fa";
import {
  useRestaurantQuery,
  useUpdateRestaurantMutation,
} from "../../hooks/useRestaurant";
import { toast } from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";

const RestaurantManagement = () => {
  const {
    data: restaurantData,
    isLoading,
    error,
    refetch,
  } = useRestaurantQuery();
  const updateRestaurantMutation = useUpdateRestaurantMutation();

  // Extract restaurant data
  const restaurant = restaurantData?.data || restaurantData;
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form data with restaurant data when available
  const initializeFormData = (restaurant) => ({
    // Basic Info
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    cuisine: restaurant?.cuisine || "",
    imageUrl: restaurant?.imageUrl || "",
    priceRange: restaurant?.priceRange || "$$",

    // Contact Info
    address: restaurant?.address || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",

    // Reservation Settings
    totalCapacity: restaurant?.totalCapacity || 100,
    avgTableCapacity: restaurant?.avgTableCapacity || 4,
    reservationSlotDuration: restaurant?.reservationSlotDuration || 120,
    maxReservationsPerDay: restaurant?.maxReservationsPerDay || 50,
    maxGuestsPerReservation: restaurant?.maxGuestsPerReservation || 10,
    advanceBookingDays: restaurant?.advanceBookingDays || 30,
    allowReservations: restaurant?.allowReservations !== false,
    serviceFees: restaurant?.serviceFees || 5.0,

    // Tables
    tablesCount: restaurant?.tablesCount || 20,

    // Social Media URLs
    facebookUrl: restaurant?.facebookUrl || "",
    instgramUrl: restaurant?.instgramUrl || "",
    xUrl: restaurant?.xUrl || "",
  });

  const [formData, setFormData] = useState(() =>
    initializeFormData(restaurantData?.success ? restaurantData.data : null)
  );

  // Update form data when new restaurant data is loaded
  React.useEffect(() => {
    if (restaurantData?.success && restaurantData.data && !formData.name) {
      setFormData(initializeFormData(restaurantData.data));
    }
  }, [restaurantData?.success, restaurantData?.data, formData.name]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (endpoint, data) => {
    try {
      await updateRestaurantMutation.mutateAsync({ endpoint, data });
      toast.success("تم حفظ البيانات بنجاح");
      refetch();
    } catch (error) {
      toast.error(`خطأ في حفظ البيانات: ${error.message}`);
    }
  };

  const tabs = [
    { id: "basic", label: "المعلومات الأساسية", icon: FaStore },
    { id: "contact", label: "معلومات التواصل", icon: FaPhone },
    { id: "social", label: "وسائل التواصل الاجتماعي", icon: FaShareAlt },
    { id: "tables", label: "الطاولات", icon: FaTable },
    { id: "reservations", label: "إعدادات الحجز", icon: FaCog },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المطعم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          خطأ في تحميل البيانات
        </h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaStore className="text-2xl text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-800">
              إدارة بيانات المطعم
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            قم بتحديث وإدارة معلومات المطعم بسهولة
          </p>
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <nav
              className="flex justify-end space-x-1 space-x-reverse px-6 py-2"
              dir="rtl"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-6 rounded-lg font-medium text-sm flex items-center gap-3 transition-all duration-300 transform ${
                      activeTab === tab.id
                        ? "bg-[#e26136] text-white shadow-lg scale-105"
                        : "text-gray-600 hover:text-[#e26136] hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <BasicInfoForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                isLoading={updateRestaurantMutation.isLoading}
              />
            )}

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <ContactInfoForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                isLoading={updateRestaurantMutation.isLoading}
              />
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <SocialMediaForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                isLoading={updateRestaurantMutation.isLoading}
              />
            )}

            {/* Tables Tab */}
            {activeTab === "tables" && (
              <TablesForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                isLoading={updateRestaurantMutation.isLoading}
              />
            )}

            {/* Reservation Settings Tab */}
            {activeTab === "reservations" && (
              <ReservationSettingsForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                isLoading={updateRestaurantMutation.isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Enhanced Basic Information Form Component
const BasicInfoForm = ({ formData, onChange, onSave, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description,
      cuisine: formData.cuisine,
      imageUrl: formData.imageUrl,
      priceRange: formData.priceRange,
    };
    onSave("basic-info", data);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <FaInfoCircle className="text-blue-600 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            المعلومات الأساسية
          </h2>
          <p className="text-gray-600 text-sm">
            قم بتحديث المعلومات الأساسية للمطعم
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المطعم *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع المطبخ
            </label>
            <input
              type="text"
              value={formData.cuisine}
              onChange={(e) => onChange("cuisine", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              maxLength={50}
              placeholder="مثل: عربي، إيطالي، آسيوي"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فئة الأسعار
            </label>
            <select
              value={formData.priceRange}
              onChange={(e) => onChange("priceRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
            >
              <option value="$">$ - اقتصادي</option>
              <option value="$$">$$ - متوسط</option>
              <option value="$$$">$$$ - راقي</option>
              <option value="$$$$">$$$$ - فاخر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط صورة المطعم
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => onChange("imageUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="https://example.com/restaurant-image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف المطعم
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
            placeholder="اكتب وصفاً شيقاً عن المطعم والأطباق المميزة"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            حفظ المعلومات الأساسية
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced Contact Information Form Component
const ContactInfoForm = ({ formData, onChange, onSave, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
    };
    onSave("contact-info", data);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4">
        <div className="bg-green-100 p-3 rounded-xl">
          <FaPhone className="text-green-600 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">معلومات الاتصال</h2>
          <p className="text-gray-600 text-sm">
            قم بتحديث بيانات الاتصال والعنوان
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="+962-6-123-4567"
              minLength={10}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="restaurant@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
            placeholder="العنوان الكامل للمطعم"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            حفظ معلومات التواصل
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced Tables Form Component
const TablesForm = ({ formData, onChange, onSave, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      tablesCount: parseInt(formData.tablesCount),
    };
    onSave("tables", data);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4">
        <div className="bg-purple-100 p-3 rounded-xl">
          <FaTable className="text-purple-600 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">إعدادات الطاولات</h2>
          <p className="text-gray-600 text-sm">
            قم بتحديد عدد الطاولات في المطعم
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عدد الطاولات
          </label>
          <input
            type="number"
            value={formData.tablesCount}
            onChange={(e) => onChange("tablesCount", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
            min="1"
            max="1000"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            العدد الإجمالي للطاولات المتاحة في المطعم
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            حفظ عدد الطاولات
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced Reservation Settings Form Component
const ReservationSettingsForm = ({ formData, onChange, onSave, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      totalCapacity: parseInt(formData.totalCapacity),
      avgTableCapacity: parseInt(formData.avgTableCapacity),
      reservationSlotDuration: parseInt(formData.reservationSlotDuration),
      maxReservationsPerDay: parseInt(formData.maxReservationsPerDay),
      maxGuestsPerReservation: parseInt(formData.maxGuestsPerReservation),
      advanceBookingDays: parseInt(formData.advanceBookingDays),
      allowReservations: formData.allowReservations,
      serviceFees: parseFloat(formData.serviceFees),
    };
    onSave("reservation-settings", data);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4">
        <div className="bg-orange-100 p-3 rounded-xl">
          <FaClock className="text-orange-600 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">إعدادات الحجوزات</h2>
          <p className="text-gray-600 text-sm">
            قم بتحديد إعدادات نظام الحجوزات
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعة الإجمالية
            </label>
            <input
              type="number"
              value={formData.totalCapacity}
              onChange={(e) => onChange("totalCapacity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="1"
              max="1000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">إجمالي الأشخاص</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              متوسط سعة الطاولة
            </label>
            <input
              type="number"
              value={formData.avgTableCapacity}
              onChange={(e) => onChange("avgTableCapacity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="1"
              max="20"
              required
            />
            <p className="text-xs text-gray-500 mt-1">أشخاص لكل طاولة</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة الفترة (دقيقة)
            </label>
            <input
              type="number"
              value={formData.reservationSlotDuration}
              onChange={(e) =>
                onChange("reservationSlotDuration", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="30"
              max="300"
              step="30"
              required
            />
            <p className="text-xs text-gray-500 mt-1">مدة الجلسة الواحدة</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حد الحجوزات اليومية
            </label>
            <input
              type="number"
              value={formData.maxReservationsPerDay}
              onChange={(e) =>
                onChange("maxReservationsPerDay", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="1"
              max="1000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">حجوزات في اليوم</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حد الضيوف للحجز
            </label>
            <input
              type="number"
              value={formData.maxGuestsPerReservation}
              onChange={(e) =>
                onChange("maxGuestsPerReservation", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="1"
              max="50"
              required
            />
            <p className="text-xs text-gray-500 mt-1">أشخاص لكل حجز</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أيام الحجز المسبق
            </label>
            <input
              type="number"
              value={formData.advanceBookingDays}
              onChange={(e) => onChange("advanceBookingDays", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="1"
              max="365"
              required
            />
            <p className="text-xs text-gray-500 mt-1">كم يوم مقدماً</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسوم الخدمة (ج.م)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.serviceFees}
              onChange={(e) => onChange("serviceFees", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">رسوم إضافية</p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowReservations"
            checked={formData.allowReservations}
            onChange={(e) => onChange("allowReservations", e.target.checked)}
            className="rounded border-gray-300 text-[#e26136] focus:ring-[#e26136] focus:ring-offset-0"
          />
          <label
            htmlFor="allowReservations"
            className="mr-2 text-sm text-gray-700"
          >
            السماح بالحجوزات
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            حفظ إعدادات الحجز
          </button>
        </div>
      </form>
    </div>
  );
};

// Social Media Form Component
const SocialMediaForm = ({ formData, onChange, onSave, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const socialData = {
      facebookUrl: formData.facebookUrl,
      instgramUrl: formData.instgramUrl,
      xUrl: formData.xUrl,
    };
    onSave("social-media", socialData);
  };

  return (
    <div className="space-y-6">
      <div className="border-r-4 border-[#e26136] bg-[#e26136]/5 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FaShareAlt className="text-[#e26136]" />
          وسائل التواصل الاجتماعي
        </h3>
        <p className="text-gray-600 text-sm">
          قم بإدارة روابط وسائل التواصل الاجتماعي الخاصة بالمطعم
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط فيسبوك
            </label>
            <input
              type="url"
              value={formData.facebookUrl}
              onChange={(e) => onChange("facebookUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="https://facebook.com/restaurant"
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط صفحة المطعم على فيسبوك
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط إنستجرام
            </label>
            <input
              type="url"
              value={formData.instgramUrl}
              onChange={(e) => onChange("instgramUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="https://instagram.com/restaurant"
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط حساب المطعم على إنستجرام
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط X (تويتر)
            </label>
            <input
              type="url"
              value={formData.xUrl}
              onChange={(e) => onChange("xUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              placeholder="https://x.com/restaurant"
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط حساب المطعم على X (تويتر سابقاً)
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            حفظ روابط التواصل الاجتماعي
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantManagement;
