import React from "react";
import { FaChartBar, FaClock } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-6">
              <FaChartBar className="mx-auto text-6xl text-gray-400 mb-4" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              التقارير والإحصائيات
            </h1>
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <FaClock className="mx-auto text-3xl text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  قريباً جداً
                </h3>
                <p className="text-green-700">
                  نعمل حالياً على تطوير نظام التقارير المفصلة والإحصائيات
                  التحليلية للمطعم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
