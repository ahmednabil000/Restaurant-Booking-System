import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner } from "react-icons/fa";
import * as reservationService from "../../../services/reservationService";

const ReservationModal = ({ isOpen, onClose, reservation, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    peopleNum: "",
    date: "",
    startTime: "",
    endTime: "",
    tableNumber: "",
    specialRequests: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (reservation) {
      setFormData({
        fullName: reservation.fullName || "",
        phone: reservation.phone || "",
        peopleNum: reservation.peopleNum || reservation.partySize || "",
        date: reservation.date || "",
        startTime: reservation.startTime || "",
        endTime: reservation.endTime || "",
        tableNumber: reservation.tableNumber || "",
        specialRequests: reservation.specialRequests || "",
        status: reservation.status || "pending",
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        peopleNum: "",
        date: "",
        startTime: "",
        endTime: "",
        tableNumber: "",
        specialRequests: "",
        status: "pending",
      });
    }
    setError("");
  }, [reservation, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.date ||
      !formData.startTime ||
      !formData.peopleNum
    ) {
      setError("الاسم والهاتف والتاريخ والوقت وعدد الأشخاص مطلوبة");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        peopleNum: parseInt(formData.peopleNum),
      };

      if (reservation) {
        await reservationService.updateReservation(reservation.id, submitData);
      } else {
        await reservationService.createReservation(submitData);
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
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {reservation ? "تعديل الحجز" : "إضافة حجز جديد"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العميل *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أحمد محمد"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+966501234567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عدد الأشخاص *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.peopleNum}
                onChange={(e) =>
                  setFormData({ ...formData, peopleNum: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التاريخ *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الطاولة
              </label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tableNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="T12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وقت البداية *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وقت النهاية
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {reservation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة الحجز
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">في الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="rejected">مرفوض</option>
                <option value="cancelled">ملغي</option>
                <option value="completed">مكتمل</option>
                <option value="no-show">لم يحضر</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات خاصة
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="طاولة بجانب النافذة، احتفال بعيد ميلاد..."
            />
          </div>

          {/* Order Details - Read Only */}
          {reservation &&
            reservation.cart &&
            reservation.cart.cartItems &&
            reservation.cart.cartItems.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#e26136]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  تفاصيل الطلب
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {reservation.cart.cartItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-white rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-1">
                            {item.meal?.title || "وجبة"}
                          </h5>
                          {item.meal?.description && (
                            <p className="text-xs text-gray-600 mb-2">
                              {item.meal.description}
                            </p>
                          )}
                          {item.meal?.category && (
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {item.meal.category}
                            </span>
                          )}
                          {item.specialInstructions && (
                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              <strong>ملاحظة:</strong>{" "}
                              {item.specialInstructions}
                            </div>
                          )}
                        </div>
                        <div className="text-right mr-3">
                          <div className="text-sm text-gray-600 mb-1">
                            {item.quantity} ×{" "}
                            {parseFloat(item.unitPrice).toFixed(2)} ج.م
                          </div>
                          <div className="text-lg font-bold text-[#e26136]">
                            {parseFloat(item.totalPrice).toFixed(2)} ج.م
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-300 pt-3 mt-3 space-y-2">
                    {reservation.cart.itemsTotal !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-700">
                          مجموع الأصناف:
                        </span>
                        <span className="text-base font-semibold text-gray-800">
                          {parseFloat(reservation.cart.itemsTotal).toFixed(2)}{" "}
                          ج.م
                        </span>
                      </div>
                    )}
                    {console.log(reservation.cart.serviceFees)}
                    {reservation.cart.serviceFees !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-700">
                          رسوم الخدمة:
                        </span>
                        <span className="text-base font-semibold text-gray-800">
                          {parseFloat(reservation.cart.serviceFees).toFixed(2)}{" "}
                          ج.م
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-400 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          الإجمالي الكلي:
                        </span>
                        <span className="text-2xl font-bold text-[#e26136]">
                          {parseFloat(reservation.cart.totalAmount).toFixed(2)}{" "}
                          ج.م
                        </span>
                      </div>
                    </div>
                    {reservation.paymentMethod && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">طريقة الدفع: </span>
                        <span
                          className={`font-semibold ${
                            reservation.paymentMethod === "card"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {reservation.paymentMethod === "card"
                            ? "💳 بطاقة ائتمانية"
                            : "💵 نقداً"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="flex items-center gap-3 pt-4">
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
                  {reservation ? "تحديث" : "إضافة"}
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

export default ReservationModal;
