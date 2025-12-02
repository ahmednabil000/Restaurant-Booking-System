import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import { useBranches } from "../../hooks/useBranches";
import * as branchesService from "../../services/branchesService";
import BranchModal from "../../components/dashboard/branches/BranchModal";
import BulkEditModal from "../../components/dashboard/branches/BulkEditModal";
import DashboardLayout from "./DashboardLayout";

const BranchesManagement = () => {
  const {
    branches,
    loading,
    error,
    refreshBranches,
    getBranchesStats,
    searchBranches,
  } = useBranches();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const stats = getBranchesStats();
  const filteredBranches = searchBranches(searchTerm);

  const handleSelectBranch = (branchId) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSelectAll = () => {
    setSelectedBranches(
      selectedBranches.length === filteredBranches.length
        ? []
        : filteredBranches.map((branch) => branch.id)
    );
  };

  const handleToggleStatus = async (branchId) => {
    setActionLoading((prev) => ({ ...prev, [branchId]: true }));
    try {
      const result = await branchesService.toggleBranchStatus(branchId);
      if (result.success) {
        refreshBranches();
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [branchId]: false }));
    }
  };

  const handleDelete = async (branchId) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;

    setActionLoading((prev) => ({ ...prev, [branchId]: true }));
    try {
      const result = await branchesService.deleteBranch(branchId);
      if (result.success) {
        refreshBranches();
        setSelectedBranches((prev) => prev.filter((id) => id !== branchId));
      } else {
        alert(`خطأ في الحذف: ${result.error}`);
      }
    } catch (error) {
      alert(`خطأ في الحذف: ${error.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [branchId]: false }));
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleBulkAction = () => {
    if (selectedBranches.length === 0) {
      alert("يرجى اختيار فرع واحد على الأقل");
      return;
    }
    setIsBulkEditOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">جاري تحميل الفروع...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-medium">خطأ في تحميل الفروع</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
          <button
            onClick={refreshBranches}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الفروع</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            إضافة فرع جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">إجمالي الفروع</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">الفروع النشطة</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <div className="text-sm text-gray-600">الفروع المغلقة</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.citiesCount}
            </div>
            <div className="text-sm text-gray-600">المدن</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {stats.countriesCount}
            </div>
            <div className="text-sm text-gray-600">البلدان</div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الفروع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              {selectedBranches.length > 0 && (
                <>
                  <button
                    onClick={handleBulkAction}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    تحرير مجمع ({selectedBranches.length})
                  </button>
                  <button
                    onClick={() => setSelectedBranches([])}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    إلغاء التحديد
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Branches Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedBranches.length === filteredBranches.length &&
                        filteredBranches.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الفرع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدينة/البلد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm ? "لا توجد فروع تطابق البحث" : "لا توجد فروع"}
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => handleSelectBranch(branch.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="h-4 w-4 text-gray-400 ml-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {branch.name}
                            </div>
                            {branch.landmark && (
                              <div className="text-sm text-gray-500">
                                {branch.landmark}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {branch.address}
                        </div>
                        {branch.zipCode && (
                          <div className="text-sm text-gray-500">
                            الرمز البريدي: {branch.zipCode}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.city}
                        </div>
                        <div className="text-sm text-gray-500">
                          {branch.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {branch.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(branch.id)}
                          disabled={actionLoading[branch.id]}
                          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            branch.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          } ${
                            actionLoading[branch.id]
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:opacity-80"
                          }`}
                        >
                          {branch.isActive ? (
                            <MdToggleOn className="ml-1" />
                          ) : (
                            <MdToggleOff className="ml-1" />
                          )}
                          {branch.isActive ? "نشط" : "مغلق"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(branch)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="تحرير"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(branch.id)}
                            disabled={actionLoading[branch.id]}
                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                            title="حذف"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <BranchModal
          branch={editingBranch}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBranch(null);
          }}
          onSuccess={refreshBranches}
        />

        <BulkEditModal
          selectedBranches={selectedBranches}
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          onSuccess={() => {
            refreshBranches();
            setSelectedBranches([]);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default BranchesManagement;
