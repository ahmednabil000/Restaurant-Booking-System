import React, { useState } from "react";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaCalculator,
  FaPercentage,
  FaCalendarAlt,
  FaFilter,
  FaDownload,
  FaSyncAlt,
  FaTable,
  FaChartBar,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import {
  useProfitLoss,
  formatCurrency,
  formatPercentage,
} from "../../hooks/useProfitLoss";
import FinancialSummaryCards from "../../components/dashboard/profitLoss/FinancialSummaryCards";
import RevenueVsExpensesChart from "../../components/dashboard/profitLoss/RevenueVsExpensesChart";
import ProfitLossTable from "../../components/dashboard/profitLoss/ProfitLossTable";

const ProfitLoss = () => {
  const {
    financialSummary,
    revenueVsExpenses,
    revenueBreakdown,
    expenseBreakdown,
    profitTrend,
    isLoading,
    isError,
    error,
    dateRange,
    setDateRange,
    chartPeriod,
    setChartPeriod,
    trendMonths,
    setTrendMonths,
    refetchAll,
  } = useProfitLoss();

  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState("charts");

  const tabs = [
    { id: "charts", label: "الإيرادات مقابل المصروفات", icon: FaChartBar },
    { id: "table", label: "جدول الأرباح والخسائر التفصيلي", icon: FaTable },
    { id: "revenue", label: "تفاصيل الإيرادات", icon: FaMoneyBillWave },
    { id: "expenses", label: "تفاصيل المصروفات", icon: FaCalculator },
  ];

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const periodOptions = [
    { value: "daily", label: "يومي" },
    { value: "weekly", label: "أسبوعي" },
    { value: "monthly", label: "شهري" },
    { value: "yearly", label: "سنوي" },
  ];

  const monthsOptions = [
    { value: 6, label: "6 أشهر" },
    { value: 12, label: "سنة واحدة" },
    { value: 24, label: "سنتان" },
    { value: 36, label: "3 سنوات" },
  ];

  if (isError) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">
                <FaChartLine />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                خطأ في تحميل البيانات
              </h2>
              <p className="text-gray-600 mb-4">
                {error?.message || "حدث خطأ أثناء جلب بيانات الأرباح والخسائر"}
              </p>
              <button
                onClick={refetchAll}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <FaSyncAlt />
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FaChartLine className="text-green-600" />
                  صفحة الأرباح والخسائر
                </h1>
                <p className="text-gray-600 mt-2">
                  تابع الأداء المالي للمطعم وحلل الإيرادات والمصروفات
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaFilter />
                  فلاتر
                </button>

                <button
                  onClick={refetchAll}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaSyncAlt className={isLoading ? "animate-spin" : ""} />
                  تحديث
                </button>

                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <FaDownload />
                  تصدير
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      من تاريخ
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        handleDateRangeChange("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      إلى تاريخ
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        handleDateRangeChange("endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Chart Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      فترة الرسم البياني
                    </label>
                    <select
                      value={chartPeriod}
                      onChange={(e) => setChartPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {periodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trend Months */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      فترة الاتجاه
                    </label>
                    <select
                      value={trendMonths}
                      onChange={(e) => setTrendMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {monthsOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Summary Cards */}
          <FinancialSummaryCards
            data={financialSummary}
            isLoading={isLoading}
          />

          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      <Icon className="text-lg" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Charts Tab */}
              {activeTab === "charts" && (
                <RevenueVsExpensesChart
                  data={revenueVsExpenses}
                  isLoading={isLoading}
                  period={chartPeriod}
                />
              )}

              {/* Table Tab */}
              {activeTab === "table" && (
                <div className="-m-6">
                  <ProfitLossTable data={profitTrend} isLoading={isLoading} />
                </div>
              )}

              {/* Revenue Details Tab */}
              {activeTab === "revenue" && (
                <div>
                  {revenueBreakdown && (
                    <div className="space-y-6">
                      {/* Top Selling Meals */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-600" />
                          أكثر الوجبات مبيعاً
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {revenueBreakdown.data?.topSellingMeals
                            ?.slice(0, 6)
                            .map((meal) => (
                              <div
                                key={meal.mealId}
                                className="bg-green-50 p-4 rounded-lg border border-green-200"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {meal.mealName}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {meal.category}
                                    </p>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {formatCurrency(meal.unitPrice)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-right">
                                    <div className="font-bold text-green-600">
                                      {formatCurrency(meal.totalRevenue)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {meal.totalQuantity} وحدة
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Revenue by Category */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">
                          الإيرادات حسب الفئة
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {revenueBreakdown.data?.revenueByCategory?.map(
                            (category, index) => (
                              <div
                                key={index}
                                className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {category.category}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {category.uniqueItems} عنصر
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-blue-600">
                                      {formatCurrency(category.totalRevenue)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {category.totalQuantity} وحدة
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!revenueBreakdown && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                      <FaMoneyBillWave className="mx-auto text-4xl mb-4 opacity-50" />
                      <p>لا توجد بيانات الإيرادات للعرض</p>
                    </div>
                  )}
                </div>
              )}

              {/* Expenses Details Tab */}
              {activeTab === "expenses" && (
                <div>
                  {expenseBreakdown && (
                    <div className="space-y-6">
                      {/* Expenses by Role */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <FaCalculator className="text-red-600" />
                          المصروفات حسب الوظيفة
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {expenseBreakdown.data?.expensesByRole?.map(
                            (role, index) => (
                              <div
                                key={index}
                                className="bg-red-50 p-4 rounded-lg border border-red-200"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {role.role}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {role.employeeCount} موظف
                                    </p>
                                  </div>
                                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    {formatPercentage(role.percentageOfTotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-right">
                                    <div className="font-bold text-red-600">
                                      {formatCurrency(role.totalSalary)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      متوسط:{" "}
                                      {formatCurrency(role.averageSalary)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Top Expenses */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">
                          أعلى المصروفات
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {expenseBreakdown.data?.topExpenses
                            ?.slice(0, 8)
                            .map((employee) => (
                              <div
                                key={employee.employeeId}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="font-medium text-gray-800">
                                      {employee.fullName}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {employee.job}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      تاريخ التوظيف:{" "}
                                      {new Date(
                                        employee.hireDate
                                      ).toLocaleDateString("ar-EG")}
                                    </p>
                                  </div>
                                  <div className="font-bold text-red-600">
                                    {formatCurrency(employee.salary)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Total Expenses Summary */}
                      <div className="bg-gray-100 p-6 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-700">
                            إجمالي المصروفات
                          </span>
                          <span className="text-2xl font-bold text-red-600">
                            {formatCurrency(
                              expenseBreakdown.data?.totalExpenses || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!expenseBreakdown && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                      <FaCalculator className="mx-auto text-4xl mb-4 opacity-50" />
                      <p>لا توجد بيانات المصروفات للعرض</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitLoss;
