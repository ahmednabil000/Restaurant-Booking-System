import React, { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaCalendarAlt,
  FaBusinessTime,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as workingDaysService from "../../services/workingDaysService";

// Components
import WorkingDayCard from "../../components/dashboard/workingDays/WorkingDayCard";
import WorkingDayModal from "../../components/dashboard/workingDays/WorkingDayModal";
import BulkEditModal from "../../components/dashboard/workingDays/BulkEditModal";

const WorkingDaysManagement = () => {
  // State
  const [workingDays, setWorkingDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  // Modal states
  const [showDayModal, setShowDayModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  // Load working days
  const loadWorkingDays = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await workingDaysService.getAllWorkingDays();
      if (response.success) {
        // Ensure we always have an array
        const daysData = Array.isArray(response.data) ? response.data : [];
        setWorkingDays(daysData);
      } else {
        setError(response.error || "خطأ في تحميل أيام العمل");
      }
    } catch (err) {
      setError(err.message || "خطأ في تحميل أيام العمل");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkingDays();
  }, [loadWorkingDays]);

  // Selection handlers
  const handleSelectDay = (dayId) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDays.length === workingDays.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(workingDays.map((day) => day.id));
    }
  };

  // Action handlers
  const handleToggleDay = async (day) => {
    try {
      const response = await workingDaysService.toggleWorkingDay(day.id);
      if (response.success) {
        await loadWorkingDays();
      } else {
        setError(response.error || "خطأ في تحديث حالة اليوم");
      }
    } catch (err) {
      setError(err.message || "خطأ في تحديث حالة اليوم");
    }
  };

  const handleDeleteDay = async (day) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${day.name}"؟`)) return;

    try {
      const response = await workingDaysService.deleteWorkingDay(day.id);
      if (response.success) {
        await loadWorkingDays();
      } else {
        setError(response.error || "خطأ في حذف اليوم");
      }
    } catch (err) {
      setError(err.message || "خطأ في حذف اليوم");
    }
  };

  const handleEditDay = (day) => {
    setEditingDay(day);
    setShowDayModal(true);
  };

  const handleAddNewDay = () => {
    setEditingDay(null);
    setShowDayModal(true);
  };

  const handleBulkEdit = () => {
    const selectedWorkingDays = workingDays.filter((day) =>
      selectedDays.includes(day.id)
    );
    setShowBulkModal(true);
  };

  // Get statistics
  const stats = {
    total: workingDays.length,
    active: workingDays.filter((day) => day.isActive).length,
    inactive: workingDays.filter((day) => !day.isActive).length,
  };

  // Sort working days by day order
  const dayOrder = {
    Monday: 1,
    الاثنين: 1,
    Tuesday: 2,
    الثلاثاء: 2,
    Wednesday: 3,
    الأربعاء: 3,
    Thursday: 4,
    الخميس: 4,
    Friday: 5,
    الجمعة: 5,
    Saturday: 6,
    السبت: 6,
    Sunday: 7,
    الأحد: 7,
  };

  const sortedWorkingDays = [...workingDays].sort((a, b) => {
    const orderA = dayOrder[a.name] || 999;
    const orderB = dayOrder[b.name] || 999;
    return orderA - orderB;
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إدارة أوقات العمل
          </h1>
          <p className="text-gray-600">تحديد أيام وأوقات العمل في المطعم</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الأيام
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <FaBusinessTime className="text-green-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">أيام نشطة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50">
                <FaClock className="text-red-600 text-xl" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">أيام معطلة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.inactive}
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
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedDays.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {selectedDays.length} من {workingDays.length} محدد
                </span>
                <button
                  onClick={handleBulkEdit}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  <FaEdit className="text-sm" />
                  تعديل جماعي
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {workingDays.length > 0 && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedDays.length === workingDays.length &&
                    workingDays.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">اختيار الكل</span>
              </label>
            )}

            <button
              onClick={handleAddNewDay}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="text-sm" />
              إضافة يوم عمل
            </button>
          </div>
        </div>

        {/* Working Days Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-300 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : sortedWorkingDays.length === 0 ? (
          <div className="text-center py-12">
            <FaClock className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              لا توجد أيام عمل محددة
            </h3>
            <p className="text-gray-500 mb-4">
              ابدأ بإضافة أيام وأوقات العمل للمطعم
            </p>
            <button
              onClick={handleAddNewDay}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              إضافة أول يوم عمل
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWorkingDays.map((day) => (
              <WorkingDayCard
                key={day.id}
                workingDay={day}
                onEdit={handleEditDay}
                onDelete={handleDeleteDay}
                onToggle={handleToggleDay}
                isSelected={selectedDays.includes(day.id)}
                onSelect={() => handleSelectDay(day.id)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <WorkingDayModal
          isOpen={showDayModal}
          onClose={() => setShowDayModal(false)}
          workingDay={editingDay}
          onSave={loadWorkingDays}
        />

        <BulkEditModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          selectedDays={workingDays.filter((day) =>
            selectedDays.includes(day.id)
          )}
          onSave={() => {
            loadWorkingDays();
            setSelectedDays([]);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default WorkingDaysManagement;
