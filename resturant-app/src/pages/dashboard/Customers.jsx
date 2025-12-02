import React from "react";
import { FaUsers, FaClock } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";

const Customers = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-6">
              <FaUsers className="mx-auto text-6xl text-gray-400 mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              إدارة العملاء
            </h1>
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <FaClock className="mx-auto text-3xl text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  قريباً جداً
                </h3>
                <p className="text-blue-700">
                  نعمل حالياً على تطوير هذه الميزة لإدارة بيانات العملاء وتتبع
                  تفاعلاتهم مع المطعم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
