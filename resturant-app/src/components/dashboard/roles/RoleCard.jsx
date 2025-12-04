import React from 'react';
import { FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';

const RoleCard = ({ role, onEdit, onDelete }) => {
  const getRoleIcon = () => {
    if (role.isSystemRole) {
      return <FaUserShield className="text-blue-600 text-xl" />;
    }
    return <FaUser className="text-gray-600 text-xl" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            role.isSystemRole ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {getRoleIcon(role.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-800">{role.displayName}</h3>
              {role.isSystemRole && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  نظام
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
            <p className="text-xs text-gray-500 mt-1">الاسم: {role.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <FaEdit />
          </button>
          {!role.isSystemRole && (
            <button
              onClick={() => onDelete(role)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className={`w-3 h-3 rounded-full ${role.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-600">
            {role.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          ID: {role.id}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;