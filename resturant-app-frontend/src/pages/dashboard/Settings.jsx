import React from "react";
import { FaCog, FaClock } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-6">
              <FaCog className="mx-auto text-6xl text-gray-400 mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">الإعدادات</h1>
            <div className="max-w-md mx-auto">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <FaClock className="mx-auto text-3xl text-orange-600 mb-3" />
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  قريباً جداً
                </h3>
                <p className="text-orange-700">
                  نعمل حالياً على تطوير لوحة الإعدادات لتخصيص المطعم وإدارة
                  التفضيلات
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
