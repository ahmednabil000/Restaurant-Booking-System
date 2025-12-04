import React from 'react';
import { FaUser, FaEdit, FaTrash, FaUserTag } from 'react-icons/fa';

const UserCard = ({ user, onEdit, onDelete, onAssignRole }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-500 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{user.fullName}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => onAssignRole(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعيين دور"
          >
            <FaUserTag />
          </button>
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-600">
            {user.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          ID: {user.id}
        </div>
      </div>
    </div>
  );
};

export default UserCard;