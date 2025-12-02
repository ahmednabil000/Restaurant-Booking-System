import React from "react";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaClock,
  FaEye,
  FaUsers,
  FaCalendarAlt,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        text: "في الانتظار",
        color: "bg-yellow-100 text-yellow-800",
        icon: FaClock,
      };
    case "confirmed":
      return {
        text: "مؤكد",
        color: "bg-green-100 text-green-800",
        icon: FaCheckCircle,
      };
    case "rejected":
      return {
        text: "مرفوض",
        color: "bg-red-100 text-red-800",
        icon: FaBan,
      };
    case "cancelled":
      return {
        text: "ملغي",
        color: "bg-gray-100 text-gray-800",
        icon: FaTimes,
      };
    case "completed":
      return {
        text: "مكتمل",
        color: "bg-blue-100 text-blue-800",
        icon: FaCheck,
      };
    case "no-show":
      return {
        text: "لم يحضر",
        color: "bg-red-100 text-red-800",
        icon: FaBan,
      };
    default:
      return {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: FaClock,
      };
  }
};

const ReservationCard = ({
  reservation,
  onView,
  onEdit,
  onConfirm,
  onReject,
  onComplete,
  onMarkNoShow,
  isSelected,
  onSelect,
}) => {
  const statusConfig = getStatusConfig(reservation.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {reservation.fullName}
            </h3>
            <p className="text-sm text-gray-600">{reservation.phone}</p>
            {reservation.email && (
              <p className="text-sm text-gray-600">{reservation.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex items-center gap-1`}
          >
            <StatusIcon className="text-xs" />
            {statusConfig.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-xs text-blue-500" />
          <span>{reservation.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FaClock className="text-xs text-green-500" />
          <span>
            {reservation.startTime} - {reservation.endTime || "مفتوح"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FaUsers className="text-xs text-purple-500" />
          <span>{reservation.partySize || reservation.peopleNum} أشخاص</span>
        </div>
        {reservation.tableNumber && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-3 h-3 bg-orange-500 rounded"></span>
            <span>طاولة {reservation.tableNumber}</span>
          </div>
        )}
      </div>

      {reservation.specialRequests && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-700">
            <strong>ملاحظات:</strong> {reservation.specialRequests}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500">
          تم الإنشاء:{" "}
          {new Date(reservation.createdAt).toLocaleDateString("ar-SA")}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(reservation)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="عرض التفاصيل"
          >
            <FaEye className="text-sm" />
          </button>

          {reservation.status === "pending" && (
            <>
              <button
                onClick={() => onConfirm(reservation)}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="تأكيد الحجز"
              >
                <FaCheck className="text-sm" />
              </button>
              <button
                onClick={() => onReject(reservation)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="رفض الحجز"
              >
                <FaTimes className="text-sm" />
              </button>
            </>
          )}

          {reservation.status === "confirmed" && (
            <>
              <button
                onClick={() => onComplete(reservation)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="إتمام الحجز"
              >
                <FaCheckCircle className="text-sm" />
              </button>
              <button
                onClick={() => onMarkNoShow(reservation)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="عدم حضور"
              >
                <FaBan className="text-sm" />
              </button>
            </>
          )}

          <button
            onClick={() => onEdit(reservation)}
            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="تعديل"
          >
            <FaEdit className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
