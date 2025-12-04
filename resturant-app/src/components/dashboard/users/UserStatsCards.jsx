import React from 'react';
import { FaUsers, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';

const UserStatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <FaUserShield className="text-purple-600 text-2xl" />;
      case 'admin':
        return <FaUserTie className="text-red-600 text-2xl" />;
      case 'staff':
        return <FaUser className="text-blue-600 text-2xl" />;
      case 'customer':
        return <FaUser className="text-green-600 text-2xl" />;
      default:
        return <FaUsers className="text-gray-600 text-2xl" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'from-purple-500 to-purple-600';
      case 'admin':
        return 'from-red-500 to-red-600';
      case 'staff':
        return 'from-blue-500 to-blue-600';
      case 'customer':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <FaUsers className="text-indigo-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Role Statistics */}
      {stats?.roles?.map((roleData) => (
        <div key={roleData.role} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 capitalize">
                {roleData.role === 'customer' && 'العملاء'}
                {roleData.role === 'staff' && 'الموظفين'}
                {roleData.role === 'admin' && 'المديرين'}
                {roleData.role === 'owner' && 'المالكين'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{roleData.count}</p>
              <p className="text-xs text-gray-500">{roleData.percentage}%</p>
            </div>
            <div className={`p-3 bg-gradient-to-r ${getRoleColor(roleData.role)} rounded-full bg-opacity-10`}>
              {getRoleIcon(roleData.role)}
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getRoleColor(roleData.role)} h-2 rounded-full`}
                style={{ width: `${roleData.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;