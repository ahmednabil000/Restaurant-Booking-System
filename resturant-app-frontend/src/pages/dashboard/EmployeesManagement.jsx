import React, { useState, useEffect, useMemo } from "react";
import {
  FaPlus,
  FaUser,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as employeesService from "../../services/employeesService";
import EmployeeModal from "../../components/dashboard/employees/EmployeeModal";
import DeleteConfirmModal from "../../components/dashboard/employees/DeleteConfirmModal";
import {
  useEmployeesQuery,
  useEmployeeOperations,
} from "../../hooks/useEmployees";

const EmployeesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit, create
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState("soft"); // soft, permanent

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 12,
  });

  // Filters
  const [filters, setFilters] = useState({
    job: "",
    isActive: "",
  });

  // Query params - using debounced search term
  const queryParams = useMemo(
    () => ({
      page: pagination.currentPage,
      limit: pagination.pageSize,
      search: debouncedSearchTerm.trim() || undefined,
      job: filters.job || undefined,
      isActive: filters.isActive || undefined,
    }),
    [
      pagination.currentPage,
      pagination.pageSize,
      debouncedSearchTerm,
      filters.job,
      filters.isActive,
    ]
  );

  // Hooks
  const {
    data: employeesResponse,
    isLoading: employeesLoading,
    error: employeesError,
  } = useEmployeesQuery(queryParams);

  const {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    permanentDeleteEmployee,
    isLoading: operationLoading,
  } = useEmployeeOperations();

  // Extract data from responses
  const employees = React.useMemo(() => {
    return employeesResponse?.data?.employees || [];
  }, [employeesResponse?.data?.employees]);

  const paginationData = employeesResponse?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  // Calculate stats from employee data
  const safeStats = React.useMemo(() => {
    const activeEmployees = employees.filter((emp) => emp.isActive);
    const inactiveEmployees = employees.filter((emp) => !emp.isActive);

    // Count by job
    const jobCounts = employees.reduce((acc, emp) => {
      if (emp.job) {
        acc[emp.job] = (acc[emp.job] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      total: employees.length,
      active: activeEmployees.length,
      inactive: inactiveEmployees.length,
      byJob: jobCounts,
    };
  }, [employees]);

  const loading = employeesLoading;
  const error = employeesError?.message || "";

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setFilters({
      job: "",
      isActive: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Modal handlers
  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteEmployee = (employee, permanent = false) => {
    setSelectedEmployee(employee);
    setDeleteMode(permanent ? "permanent" : "soft");
    setShowDeleteConfirm(true);
  };

  // Save employee (create or update)
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (modalMode === "create") {
        await createEmployee(employeeData);
      } else if (modalMode === "edit") {
        await updateEmployee({ id: selectedEmployee.id, data: employeeData });
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (deleteMode === "permanent") {
        await permanentDeleteEmployee(selectedEmployee.id);
      } else {
        await deleteEmployee(selectedEmployee.id);
      }
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              إدارة الموظفين
            </h1>
            <p className="text-gray-600">
              إدارة ومتابعة موظفي المطعم وبياناتهم الوظيفية
            </p>
          </div>
          <button
            onClick={handleCreateEmployee}
            className="bg-[#e26136] text-white px-6 py-3 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2 shadow-md"
          >
            <FaPlus className="text-sm" />
            إضافة موظف جديد
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  إجمالي الموظفين
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {safeStats.total}
                </p>
              </div>
              <FaUserTie className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  موظفين نشطين
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {safeStats.active}
                </p>
              </div>
              <FaUser className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  موظفين غير نشطين
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {safeStats.inactive}
                </p>
              </div>
              <FaUser className="text-red-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  أقسام العمل
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(safeStats.byJob).length}
                </p>
              </div>
              <FaBriefcase className="text-purple-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
                {debouncedSearchTerm !== searchTerm && (
                  <span className="text-xs text-gray-400 mr-2">
                    (جاري البحث...)
                  </span>
                )}
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="البحث بالاسم، الحساب, الهاتف..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Filter */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوظيفة
              </label>
              <select
                value={filters.job}
                onChange={(e) => handleFilterChange("job", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              >
                <option value="">جميع الوظائف</option>
                {employeesService.JOB_POSITIONS.map((job) => (
                  <option key={job} value={job}>
                    {employeesService.getJobInArabic(job)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange("isActive", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e26136] focus:border-transparent"
              >
                <option value="">جميع الموظفين</option>
                <option value="true">نشط</option>
                <option value="false">غير نشط</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-transparent mb-2">
                &nbsp;
              </label>
              <button
                onClick={handleResetFilters}
                disabled={!searchTerm && !filters.job && !filters.isActive}
                className="w-full lg:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaFilter className="text-sm" />
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136]"></div>
          </div>
        ) : (
          <>
            {/* Employees Grid */}
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  لا توجد موظفين
                </h3>
                <p className="text-gray-500 mb-4">
                  لم يتم العثور على موظفين تطابق المعايير المحددة
                </p>
                <button
                  onClick={handleCreateEmployee}
                  className="bg-[#e26136] text-white px-6 py-2 rounded-lg hover:bg-[#cd4f25]"
                >
                  إضافة موظف جديد
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {employees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onView={handleViewEmployee}
                      onEdit={handleEditEmployee}
                      onDelete={handleDeleteEmployee}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {paginationData.totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(paginationData.currentPage - 1)
                        }
                        disabled={paginationData.currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        السابق
                      </button>

                      {Array.from(
                        { length: paginationData.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded-lg ${
                            page === paginationData.currentPage
                              ? "bg-[#e26136] text-white border-[#e26136]"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          handlePageChange(paginationData.currentPage + 1)
                        }
                        disabled={
                          paginationData.currentPage ===
                          paginationData.totalPages
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        التالي
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Employee Modal */}
      {showModal && (
        <EmployeeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          employee={selectedEmployee}
          mode={modalMode}
          onSave={handleSaveEmployee}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          employee={selectedEmployee}
          permanent={deleteMode === "permanent"}
          loading={operationLoading}
        />
      )}
    </DashboardLayout>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, onView, onEdit, onDelete }) => {
  const formatSalary = (salary) => {
    return salary ? `${parseFloat(salary).toLocaleString()} ج.م` : "غير محدد";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Employee Avatar */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <FaUser className="text-gray-500" />
        </div>
        <div className="mr-3 flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">
            {employee.fullName}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                employee.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {employee.isActive ? "نشط" : "غير نشط"}
            </span>
          </div>
        </div>
      </div>

      {/* Employee Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FaBriefcase className="text-gray-400" />
          <span className="text-gray-600">
            {employeesService.getJobInArabic(employee.job)}
          </span>
        </div>

        {employee.email && (
          <div className="flex items-center gap-2 text-sm">
            <FaUser className="text-gray-400" />
            <span className="text-gray-600 truncate">{employee.email}</span>
          </div>
        )}

        {employee.phone && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📞</span>
            <span className="text-gray-600">{employee.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <FaMoneyBillWave className="text-gray-400" />
          <span className="text-gray-600">{formatSalary(employee.salary)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FaCalendarAlt className="text-gray-400" />
          <span className="text-gray-600">
            انضم: {formatDate(employee.hireDate)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onView(employee)}
          className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
        >
          <FaEye className="text-xs" />
          عرض
        </button>
        <button
          onClick={() => onEdit(employee)}
          className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
        >
          <FaEdit className="text-xs" />
          تعديل
        </button>
        <button
          onClick={() => onDelete(employee)}
          className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
        >
          <FaTrash className="text-xs" />
          حذف
        </button>
      </div>
    </div>
  );
};

export default EmployeesManagement;
