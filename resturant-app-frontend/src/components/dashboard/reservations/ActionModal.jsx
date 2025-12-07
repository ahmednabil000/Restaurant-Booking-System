import React, { useState } from "react";
import { FaTimes, FaCheck, FaBan } from "react-icons/fa";

const ActionModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  type = "confirm", // confirm, reject, complete, no-show
  showReasonInput = false,
  showTableInput = false,
}) => {
  const [reason, setReason] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const data = {};
      if (showReasonInput) data.reason = reason;
      if (showTableInput) data.tableNumber = tableNumber;

      await onConfirm(data);
      onClose();
      setReason("");
      setTableNumber("");
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "confirm":
        return "bg-green-600 hover:bg-green-700";
      case "reject":
        return "bg-red-600 hover:bg-red-700";
      case "complete":
        return "bg-blue-600 hover:bg-blue-700";
      case "no-show":
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return <FaCheck />;
      case "reject":
        return <FaBan />;
      default:
        return <FaCheck />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 mb-4">{message}</p>

        {showTableInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الطاولة
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="T12"
            />
          </div>
        )}

        {showReasonInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السبب *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="برجاء توضيح السبب..."
              required={showReasonInput}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading || (showReasonInput && !reason.trim())}
            className={`flex-1 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${getButtonColor()}`}
          >
            {loading ? (
              "جار المعالجة..."
            ) : (
              <>
                {getIcon()}
                تأكيد
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
