import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaFilter,
  FaImage,
  FaStar,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as pagesService from "../../services/pagesService";

// Components
import PageCard from "../../components/dashboard/pages/PageCard";
import PageModal from "../../components/dashboard/pages/PageModal";
import BranchCard from "../../components/dashboard/pages/BranchCard";
import BranchModal from "../../components/dashboard/pages/BranchModal";

const PagesManagement = () => {
  const [activeTab, setActiveTab] = useState("pages");

  // Pages state
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [pagesError, setPagesError] = useState("");
  const [pageSearchTerm, setPageSearchTerm] = useState("");
  const [pageFilters, setPageFilters] = useState({
    active: "",
  });

  // Branches state
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState("");
  const [branchSearchTerm, setBranchSearchTerm] = useState("");

  // Modal states
  const [showPageModal, setShowPageModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);

  // Load pages
  const loadPages = useCallback(async () => {
    setPagesLoading(true);
    setPagesError("");
    try {
      const params = {
        ...pageFilters,
        search: pageSearchTerm || undefined,
      };

      // Clean up empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await pagesService.getAllPages(params);
      if (response.success) {
        // Ensure we always have an array
        const pagesData = Array.isArray(response.data) ? response.data : [];
        setPages(pagesData);
      } else {
        setPagesError(response.error || "خطأ في تحميل الصفحات");
      }
    } catch (err) {
      setPagesError(err.message || "خطأ في تحميل الصفحات");
    } finally {
      setPagesLoading(false);
    }
  }, [pageFilters, pageSearchTerm]);

  // Load branches
  const loadBranches = useCallback(async () => {
    setBranchesLoading(true);
    setBranchesError("");
    try {
      const response = await pagesService.getAllBranches();
      if (response.success) {
        // Ensure we always have an array
        const branchesData = Array.isArray(response.data) ? response.data : [];
        setBranches(branchesData);
      } else {
        setBranchesError(response.error || "خطأ في تحميل الفروع");
      }
    } catch (err) {
      setBranchesError(err.message || "خطأ في تحميل الفروع");
    } finally {
      setBranchesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (activeTab === "branches") {
      loadBranches();
    }
  }, [loadBranches, activeTab]);

  // Filter pages based on search
  const filteredPages = Array.isArray(pages)
    ? pages.filter(
        (page) =>
          page.title?.toLowerCase().includes(pageSearchTerm.toLowerCase()) ||
          page.slug?.toLowerCase().includes(pageSearchTerm.toLowerCase())
      )
    : [];

  // Filter branches based on search
  const filteredBranches = Array.isArray(branches)
    ? branches.filter(
        (branch) =>
          branch.name?.toLowerCase().includes(branchSearchTerm.toLowerCase()) ||
          branch.address?.toLowerCase().includes(branchSearchTerm.toLowerCase())
      )
    : [];

  // Page handlers
  const handleDeletePage = async (page) => {
    if (!window.confirm(`هل أنت متأكد من حذف الصفحة "${page.title}"؟`)) return;

    try {
      const response = await pagesService.deletePage(page.id);
      if (response.success) {
        await loadPages();
      } else {
        setPagesError(response.error || "خطأ في حذف الصفحة");
      }
    } catch (err) {
      setPagesError(err.message || "خطأ في حذف الصفحة");
    }
  };

  const handleTogglePageStatus = async (page) => {
    try {
      const response = await pagesService.updatePage(page.id, {
        isActive: !page.isActive,
      });
      if (response.success) {
        await loadPages();
      } else {
        setPagesError(response.error || "خطأ في تحديث حالة الصفحة");
      }
    } catch (err) {
      setPagesError(err.message || "خطأ في تحديث حالة الصفحة");
    }
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setShowPageModal(true);
  };

  const handleAddNewPage = () => {
    setEditingPage(null);
    setShowPageModal(true);
  };

  // Branch handlers
  const handleDeleteBranch = async (branch) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفرع "${branch.name}"؟`)) return;

    try {
      const response = await pagesService.deleteBranch(branch.id);
      if (response.success) {
        await loadBranches();
      } else {
        setBranchesError(response.error || "خطأ في حذف الفرع");
      }
    } catch (err) {
      setBranchesError(err.message || "خطأ في حذف الفرع");
    }
  };

  const handleToggleBranchStatus = async (branch) => {
    try {
      const response = await pagesService.updateBranch(branch.id, {
        isActive: !branch.isActive,
      });
      if (response.success) {
        await loadBranches();
      } else {
        setBranchesError(response.error || "خطأ في تحديث حالة الفرع");
      }
    } catch (err) {
      setBranchesError(err.message || "خطأ في تحديث حالة الفرع");
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowBranchModal(true);
  };

  const handleAddNewBranch = () => {
    setEditingBranch(null);
    setShowBranchModal(true);
  };

  const handleFiltersChange = (newFilters) => {
    setPageFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إدارة المحتوى الثابت
          </h1>
          <p className="text-gray-600">إدارة صفحات الموقع والفروع</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "pages"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaImage className="inline ml-1" />
              إدارة الصفحات
            </button>
            <button
              onClick={() => setActiveTab("branches")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "branches"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaStar className="inline ml-1" />
              إدارة الفروع
            </button>
          </div>
        </div>

        {/* Pages Tab */}
        {activeTab === "pages" && (
          <>
            {pagesError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {pagesError}
              </div>
            )}

            {/* Pages Actions Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="البحث في الصفحات..."
                      value={pageSearchTerm}
                      onChange={(e) => setPageSearchTerm(e.target.value)}
                      className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <FaFilter className="inline ml-1" />
                    {filteredPages.length} من {pages.length} صفحة
                  </div>
                </div>

                <button
                  onClick={handleAddNewPage}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                  إضافة صفحة جديدة
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={pageFilters.active}
                  onChange={(e) =>
                    handleFiltersChange({ active: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الحالات</option>
                  <option value="true">نشطة</option>
                  <option value="false">غير نشطة</option>
                </select>
              </div>
            </div>

            {/* Pages Grid */}
            {pagesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-300 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {pageSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد صفحات"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {pageSearchTerm
                    ? `لم يتم العثور على صفحات تحتوي على "${pageSearchTerm}"`
                    : "ابدأ بإضافة صفحات جديدة لموقع المطعم"}
                </p>
                {!pageSearchTerm && (
                  <button
                    onClick={handleAddNewPage}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    إضافة أول صفحة
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages.map((page) => (
                  <PageCard
                    key={page.id}
                    page={page}
                    onEdit={handleEditPage}
                    onDelete={handleDeletePage}
                    onToggleStatus={handleTogglePageStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Branches Tab */}
        {activeTab === "branches" && (
          <>
            {branchesError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {branchesError}
              </div>
            )}

            {/* Branches Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="البحث في الفروع..."
                    value={branchSearchTerm}
                    onChange={(e) => setBranchSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <FaFilter className="inline ml-1" />
                  {filteredBranches.length} من {branches.length} فرع
                </div>
              </div>

              <button
                onClick={handleAddNewBranch}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="text-sm" />
                إضافة فرع جديد
              </button>
            </div>

            {/* Branches Grid */}
            {branchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-300 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="text-center py-12">
                <FaStar className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {branchSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد فروع"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {branchSearchTerm
                    ? `لم يتم العثور على فروع تحتوي على "${branchSearchTerm}"`
                    : "ابدأ بإضافة فروع المطعم"}
                </p>
                {!branchSearchTerm && (
                  <button
                    onClick={handleAddNewBranch}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    إضافة أول فرع
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    onEdit={handleEditBranch}
                    onDelete={handleDeleteBranch}
                    onToggleStatus={handleToggleBranchStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <PageModal
          isOpen={showPageModal}
          onClose={() => setShowPageModal(false)}
          page={editingPage}
          onSave={loadPages}
        />

        <BranchModal
          isOpen={showBranchModal}
          onClose={() => setShowBranchModal(false)}
          branch={editingBranch}
          onSave={loadBranches}
        />
      </div>
    </DashboardLayout>
  );
};

export default PagesManagement;
