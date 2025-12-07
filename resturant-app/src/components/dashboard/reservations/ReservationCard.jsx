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

      {/* Cart Summary */}
      {reservation.cart &&
        reservation.cart.cartItems &&
        reservation.cart.cartItems.length > 0 && (
          <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                تفاصيل الطلب:
              </span>
              <span className="text-xs text-gray-600">
                {reservation.cart.cartItems.length} صنف
              </span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {reservation.cart.cartItems.slice(0, 3).map((item, index) => (
                <div
                  key={item.id || index}
                  className="text-xs text-gray-700 flex justify-between"
                >
                  <span>
                    {item.quantity}× {item.meal?.title || "وجبة"}
                  </span>
                  <span className="font-medium">{item.totalPrice} ج.م</span>
                </div>
              ))}
              {reservation.cart.cartItems.length > 3 && (
                <div className="text-xs text-gray-500 italic">
                  و {reservation.cart.cartItems.length - 3} أصناف أخرى...
                </div>
              )}
            </div>
            <div className="border-t border-orange-300 mt-2 pt-2 space-y-1">
              {reservation.cart.itemsTotal !== undefined && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">مجموع الأصناف:</span>
                  <span className="font-medium text-gray-700">
                    {parseFloat(reservation.cart.itemsTotal).toFixed(2)} ج.م
                  </span>
                </div>
              )}
              {reservation.cart.serviceFees !== undefined && (
                <div className="flex justify-between items-center text-xs bg-blue-50 px-2 py-1 rounded">
                  <span className="text-gray-700 font-semibold">
                    رسوم الخدمة:
                  </span>
                  <span className="font-bold text-blue-600">
                    {parseFloat(reservation.cart.serviceFees).toFixed(2)} ج.م
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-orange-200">
                <span className="text-sm font-bold text-gray-800">
                  الإجمالي:
                </span>
                <span className="text-sm font-bold text-[#e26136]">
                  {parseFloat(reservation.cart.totalAmount).toFixed(2)} ج.م
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Payment Method Badge */}
      {reservation.paymentMethod && (
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              reservation.paymentMethod === "card"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {reservation.paymentMethod === "card" ? "💳 بطاقة" : "💵 نقداً"}
          </span>
        </div>
      )}

     

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500">
          تم الإنشاء:{" "}
          {new Date(reservation.createdAt).toLocaleDateString("en-GB")}
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
