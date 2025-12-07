import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaCheck,
  FaTimes,
  FaLayerGroup,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as reservationService from "../../services/reservationService";

// Import components
import ReservationCard from "../../components/dashboard/reservations/ReservationCard";
import ReservationModal from "../../components/dashboard/reservations/ReservationModal";
import ActionModal from "../../components/dashboard/reservations/ActionModal";
import BulkActionsModal from "../../components/dashboard/reservations/BulkActionsModal";
import Pagination from "../../components/dashboard/menu/Pagination";

const ReservationsManagement = () => {
  // State management
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination and filters
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    startDate: "",
    endDate: "",
    peopleNum: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Selection state
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Modal states
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [actionData, setActionData] = useState({ type: "", reservation: null });

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    total: 0,
  });

  // Load reservations
  const loadReservations = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          pageSize: pagination.pageSize,
          ...filters,
        };

        // Clean up empty filters
        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === undefined) {
            delete params[key];
          }
        });

        const response = await reservationService.getAllReservations(params);

        if (response.success && response.data) {
          setReservations(response.data.reservations || []);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.pagination?.currentPage || page,
            totalPages: response.data.pagination?.totalPages || 1,
            totalItems: response.data.pagination?.totalItems || 0,
          }));

          // Calculate stats
          const allReservations = response.data.reservations || [];
          setStats({
            total: allReservations.length,
            pending: allReservations.filter((r) => r.status === "pending")
              .length,
            confirmed: allReservations.filter((r) => r.status === "confirmed")
              .length,
            completed: allReservations.filter((r) => r.status === "completed")
              .length,
          });
        }
      } catch (err) {
        setError(err.message || "خطأ في تحميل الحجوزات");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.pageSize]
  );

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Selection handlers
  const handleSelectReservation = (reservationId) => {
    setSelectedReservations((prev) =>
      prev.includes(reservationId)
        ? prev.filter((id) => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  // Action handlers
  const handleViewReservation = (reservation) => {
    setEditingReservation(reservation);
    setShowReservationModal(true);
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setShowReservationModal(true);
  };

  const handleConfirmReservation = (reservation) => {
    setActionData({ type: "confirm", reservation });
    setShowActionModal(true);
  };

  const handleRejectReservation = (reservation) => {
    setActionData({ type: "reject", reservation });
    setShowActionModal(true);
  };

  const handleCompleteReservation = (reservation) => {
    setActionData({ type: "complete", reservation });
    setShowActionModal(true);
  };

  const handleMarkNoShow = (reservation) => {
    setActionData({ type: "no-show", reservation });
    setShowActionModal(true);
  };

  // Action execution
  const executeAction = async (data = {}) => {
    const { type, reservation } = actionData;

    try {
      switch (type) {
        case "confirm":
          await reservationService.confirmReservation(reservation.id, data);
          break;
        case "reject":
          await reservationService.rejectReservation(
            reservation.id,
            data.reason
          );
          break;
        case "complete":
          await reservationService.completeReservation(reservation.id);
          break;
        case "no-show":
          await reservationService.markNoShow(reservation.id);
          break;
        default:
          throw new Error("إجراء غير معروف");
      }

      await loadReservations(pagination.currentPage);
    } catch (err) {
      setError(err.message || "خطأ في تنفيذ الإجراء");
    }
  };

  // Bulk actions
  const handleBulkAction = async (reservationIds, status, reason) => {
    try {
      await reservationService.bulkUpdateStatus(reservationIds, status, reason);
      await loadReservations(pagination.currentPage);
      setSelectedReservations([]);
      setSelectAll(false);
    } catch (err) {
      setError(err.message || "خطأ في الإجراء الجماعي");
    }
  };

  // Filter handlers
  const handleFiltersChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    loadReservations(newPage);
  };

  const handleAddNewReservation = () => {
    setEditingReservation(null);
    setShowReservationModal(true);
  };

  // Action modal configuration
  const getActionModalConfig = () => {
    const { type, reservation } = actionData;

    switch (type) {
      case "confirm":
        return {
          title: "تأكيد الحجز",
          message: `هل تريد تأكيد حجز ${reservation?.fullName}؟`,
          showTableInput: true,
        };
      case "reject":
        return {
          title: "رفض الحجز",
          message: `هل تريد رفض حجز ${reservation?.fullName}؟`,
          showReasonInput: true,
        };
      case "complete":
        return {
          title: "إتمام الحجز",
          message: `هل تريد إتمام حجز ${reservation?.fullName}؟`,
        };
      case "no-show":
        return {
          title: "عدم الحضور",
          message: `هل تريد تسجيل عدم حضور لحجز ${reservation?.fullName}؟`,
        };
      default:
        return {};
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إدارة الحجوزات
          </h1>
          <p className="text-gray-600">عرض وإدارة جميع حجوزات المطعم</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الحجوزات
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">مؤكدة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <FaCheck className="text-blue-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="البحث في الحجوزات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedReservations.length > 0 && (
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  <FaLayerGroup className="text-sm" />
                  إجراء جماعي ({selectedReservations.length})
                </button>
              )}

              <button
                onClick={handleAddNewReservation}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaPlus className="text-sm" />
                حجز جديد
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={filters.status}
              onChange={(e) => handleFiltersChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="rejected">مرفوض</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
              <option value="no-show">لم يحضر</option>
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFiltersChange({ date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="التاريخ"
            />

            <input
              type="number"
              min="1"
              max="20"
              value={filters.peopleNum}
              onChange={(e) =>
                handleFiltersChange({ peopleNum: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="عدد الأشخاص"
            />

            <select
              value={filters.sortBy}
              onChange={(e) => handleFiltersChange({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">تاريخ الإنشاء</option>
              <option value="date">تاريخ الحجز</option>
              <option value="startTime">وقت الحجز</option>
              <option value="peopleNum">عدد الأشخاص</option>
              <option value="status">الحالة</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFiltersChange({ sortOrder: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DESC">تنازلي</option>
              <option value="ASC">تصاعدي</option>
            </select>

            {selectedReservations.length > 0 && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">اختيار الكل</span>
              </label>
            )}
          </div>
        </div>

        {/* Reservations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-300 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              لا توجد حجوزات
            </h3>
            <p className="text-gray-500 mb-4">
              لم يتم العثور على حجوزات تطابق المعايير المحددة
            </p>
            <button
              onClick={handleAddNewReservation}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              إضافة حجز جديد
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onView={handleViewReservation}
                  onEdit={handleEditReservation}
                  onConfirm={handleConfirmReservation}
                  onReject={handleRejectReservation}
                  onComplete={handleCompleteReservation}
                  onMarkNoShow={handleMarkNoShow}
                  isSelected={selectedReservations.includes(reservation.id)}
                  onSelect={() => handleSelectReservation(reservation.id)}
                />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Modals */}
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          reservation={editingReservation}
          onSave={() => loadReservations(pagination.currentPage)}
        />

        <ActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          {...getActionModalConfig()}
          type={actionData.type}
          onConfirm={executeAction}
        />

        <BulkActionsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedReservations={reservations.filter((r) =>
            selectedReservations.includes(r.id)
          )}
          onBulkAction={handleBulkAction}
        />
      </div>
    </DashboardLayout>
  );
};

export default ReservationsManagement;
