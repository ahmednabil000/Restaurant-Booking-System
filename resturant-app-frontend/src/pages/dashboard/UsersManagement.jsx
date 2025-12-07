import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaUser,
  FaUserShield,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import * as usersService from "../../services/usersService";
import * as rolesService from "../../services/rolesService";

// Import components
import UserCard from "../../components/dashboard/users/UserCard";
import UserModal from "../../components/dashboard/users/UserModal";
import AssignRoleModal from "../../components/dashboard/users/AssignRoleModal";
import UserStatsCards from "../../components/dashboard/users/UserStatsCards";
import UsersPagination from "../../components/dashboard/users/UsersPagination";
import RoleCard from "../../components/dashboard/roles/RoleCard";
import RoleModal from "../../components/dashboard/roles/RoleModal";
import Pagination from "../../components/Pagination";

const UsersManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  
  // Users state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Roles state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,
  });
  
  // Filters
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
  });
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [assigningRoleUser, setAssigningRoleUser] = useState(null);

  // Load users
  const loadUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const params = {
        page,
        pageSize: pagination.pageSize,
        ...filters,
        search: userSearchTerm || undefined,
      };
      
      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await usersService.getUsers(params);
      if (response && response.success) {
        setUsers(response.data?.users || []);
        setPagination(prev => ({
          ...prev,
          currentPage: response.data?.pagination?.currentPage || page,
          totalPages: response.data?.pagination?.totalPages || 1,
        }));
      }
    } catch (err) {
      setUsersError(err.message || "خطأ في تحميل المستخدمين");
    } finally {
      setUsersLoading(false);
    }
  }, [filters, userSearchTerm, pagination.pageSize]);

  // Load user stats
  const loadUserStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await usersService.getUserStats();
      if (response && response.success) {
        setUserStats(response.data);
      }
    } catch (err) {
      console.error("Error loading user stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load roles
  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError("");
    try {
      const response = await rolesService.getRoles(true);
      if (response.success) {
        setRoles(response.data?.roles || []);
      }
    } catch (err) {
      setRolesError(err.message || "خطأ في تحميل الأدوار");
    } finally {
      setRolesLoading(false);
    }
  }, []);

  // Filter users
  const filterUsers = useCallback(() => {
    if (!userSearchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
        )
      );
    }
  }, [users, userSearchTerm]);

  // Effects
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
      loadUserStats();
    } else if (activeTab === "roles") {
      loadRoles();
    }
  }, [activeTab, loadUsers, loadUserStats, loadRoles]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  // User handlers
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${user.fullName}"؟`)) return;
    
    try {
      await usersService.deleteUser(user.id);
      await loadUsers(pagination.currentPage);
      await loadUserStats();
    } catch (err) {
      setUsersError(err.message || "خطأ في حذف المستخدم");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleAssignRole = (user) => {
    setAssigningRoleUser(user);
    setShowAssignRoleModal(true);
  };

  const handleAddNewUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleSaveUser = async (userId, userData) => {
    if (userId) {
      await usersService.updateUser(userId, userData);
    } else {
      await usersService.createUser(userData);
    }
    await loadUsers(pagination.currentPage);
    await loadUserStats();
  };

  const handleSaveRoleAssignment = async (userId, role) => {
    await usersService.assignRole(userId, role);
    await loadUsers(pagination.currentPage);
    await loadUserStats();
  };

  // Role handlers
  const handleDeleteRole = async (role) => {
    if (!window.confirm(`هل أنت متأكد من حذف الدور "${role.displayName}"؟`)) return;
    
    try {
      await rolesService.deleteRole(role.id);
      await loadRoles();
    } catch (err) {
      setRolesError(err.message || "خطأ في حذف الدور");
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleAddNewRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleSaveRole = async (roleId, roleData) => {
    if (roleId) {
      await rolesService.updateRole(roleId, roleData);
    } else {
      await rolesService.createRole(roleData);
    }
    await loadRoles();
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    loadUsers(newPage);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filter roles for search
  const filteredRoles = roles.filter(role =>
    !roleSearchTerm.trim() || 
    role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
    role.displayName.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المستخدمين والأدوار</h1>
          <p className="text-gray-600">إدارة حسابات المستخدمين وأدوارهم في النظام</p>
        </div>

        {/* Stats Cards - Show only on users tab */}
        {activeTab === "users" && (
          <UserStatsCards stats={userStats} loading={statsLoading} />
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUser className="inline ml-1" />
              إدارة المستخدمين
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "roles"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUserShield className="inline ml-1" />
              إدارة الأدوار
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            {usersError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {usersError}
              </div>
            )}

            {/* Users Actions Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="البحث في المستخدمين..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddNewUser}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                  إضافة مستخدم جديد
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={filters.role}
                  onChange={(e) => handleFiltersChange({ role: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الأدوار</option>
                  <option value="customer">عميل</option>
                  <option value="staff">موظف</option>
                  <option value="admin">مدير</option>
                  <option value="owner">مالك</option>
                  {roles.filter(role => !['customer', 'staff', 'admin', 'owner'].includes(role.name)).map(role => (
                    <option key={role.name} value={role.name}>
                      {role.displayName}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.isActive}
                  onChange={(e) => handleFiltersChange({ isActive: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الحالات</option>
                  <option value="true">نشط</option>
                  <option value="false">غير نشط</option>
                </select>

                <div className="text-sm text-gray-600">
                  <FaFilter className="inline ml-1" />
                  {filteredUsers.length} من {users.length} مستخدم
                </div>
              </div>
            </div>

            {/* Users Grid */}
            {usersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {userSearchTerm ? "لا توجد نتائج للبحث" : "لا يوجد مستخدمين"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {userSearchTerm 
                    ? `لم يتم العثور على مستخدمين يحتووا على "${userSearchTerm}"`
                    : "ابدأ بإضافة مستخدمين جدد إلى النظام"
                  }
                </p>
                {!userSearchTerm && (
                  <button
                    onClick={handleAddNewUser}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    إضافة أول مستخدم
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      onAssignRole={handleAssignRole}
                    />
                  ))}
                </div>
                
                <UsersPagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <>
            {rolesError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {rolesError}
              </div>
            )}

            {/* Roles Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="البحث في الأدوار..."
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <FaFilter className="inline ml-1" />
                  {filteredRoles.length} من {roles.length} دور
                </div>
              </div>

              <button
                onClick={handleAddNewRole}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="text-sm" />
                إضافة دور جديد
              </button>
            </div>

            {/* Roles Grid */}
            {rolesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-12">
                <FaUserShield className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {roleSearchTerm ? "لا توجد نتائج للبحث" : "لا توجد أدوار"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {roleSearchTerm 
                    ? `لم يتم العثور على أدوار تحتوي على "${roleSearchTerm}"`
                    : "ابدأ بإضافة أدوار جديدة لتنظيم صلاحيات المستخدمين"
                  }
                </p>
                {!roleSearchTerm && (
                  <button
                    onClick={handleAddNewRole}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    إضافة أول دور
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onEdit={handleEditRole}
                    onDelete={handleDeleteRole}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <UserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          user={editingUser}
          onSave={handleSaveUser}
          availableRoles={roles.filter(role => !role.isSystemRole)}
        />

        <AssignRoleModal
          isOpen={showAssignRoleModal}
          onClose={() => setShowAssignRoleModal(false)}
          user={assigningRoleUser}
          onSave={handleSaveRoleAssignment}
          availableRoles={roles.filter(role => !role.isSystemRole)}
        />

        <RoleModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          role={editingRole}
          onSave={handleSaveRole}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersManagement;
