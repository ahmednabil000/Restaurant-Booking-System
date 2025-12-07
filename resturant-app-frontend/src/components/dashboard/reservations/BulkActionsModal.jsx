import React, { useState } from "react";
import { FaTimes, FaLayerGroup } from "react-icons/fa";

const BulkActionsModal = ({
  isOpen,
  onClose,
  selectedReservations,
  onBulkAction,
}) => {
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!action) return;

    setLoading(true);
    try {
      const reservationIds = selectedReservations.map((r) => r.id);
      await onBulkAction(reservationIds, action, reason);
      onClose();
      setAction("");
      setReason("");
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">إجراء جماعي</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          تم اختيار {selectedReservations.length} حجز للإجراء الجماعي
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الإجراء المطلوب
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">اختر الإجراء</option>
              <option value="confirmed">تأكيد جميع الحجوزات</option>
              <option value="rejected">رفض جميع الحجوزات</option>
              <option value="completed">إتمام جميع الحجوزات</option>
              <option value="no-show">تسجيل عدم حضور</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السبب أو الملاحظة
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="سبب الإجراء الجماعي..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !action}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "جار المعالجة..."
              ) : (
                <>
                  <FaLayerGroup />
                  تنفيذ الإجراء
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

export default BulkActionsModal;
