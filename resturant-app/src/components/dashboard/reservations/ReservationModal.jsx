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
