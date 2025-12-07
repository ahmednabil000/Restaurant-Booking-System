import React, { useState } from "react";
import {
  FaTable,
  FaArrowUp,
  FaArrowDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import { formatCurrency, formatPercentage } from "../../../hooks/useProfitLoss";

const TableHeader = ({ label, sortKey, sortConfig, onSort }) => {
  const isSorted = sortConfig.key === sortKey;
  const isAscending = isSorted && sortConfig.direction === "asc";

  return (
    <th
      className={`px-4 py-3 text-right bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
        isSorted ? "text-blue-600" : "text-gray-700"
      }`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{label}</span>
        {isSorted &&
          (isAscending ? (
            <FaSortAmountUp className="text-blue-500" />
          ) : (
            <FaSortAmountDown className="text-blue-500" />
          ))}
      </div>
    </th>
  );
};

const TableRow = ({ data, index, bestMonth, worstMonth }) => {
  const isHighlighted = bestMonth === index || worstMonth === index;
  const isBest = bestMonth === index;
  const isWorst = worstMonth === index;

  const rowClass = `
    border-b border-gray-200 hover:bg-gray-50 transition-colors
    ${
      isHighlighted
        ? isBest
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
        : ""
    }
  `;

  const profitTrend =
    data.growthRate > 0 ? "up" : data.growthRate < 0 ? "down" : "neutral";

  return (
    <tr className={rowClass}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {data.monthName} {data.year}
          </span>
          {isBest && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              أفضل شهر
            </span>
          )}
          {isWorst && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              أسوأ شهر
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-semibold text-green-600">
        {formatCurrency(data.revenue)}
      </td>
      <td className="px-4 py-3 font-semibold text-red-600">
        {formatCurrency(data.expenses)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${
              data.profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(data.profit)}
          </span>
          {data.growthRate !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs ${
                profitTrend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {profitTrend === "up" ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(data.growthRate).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`font-semibold ${
            data.profitMargin >= 30
              ? "text-green-600"
              : data.profitMargin >= 15
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {formatPercentage(data.profitMargin)}
        </span>
      </td>
    </tr>
  );
};

const SummaryRow = ({ data, label, isTotal = false }) => {
  if (!data || !data.summary) return null;

  const { totalRevenue, totalExpenses, totalProfit, averageMonthlyProfit } =
    data.summary;
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <tr
      className={`${
        isTotal
          ? "bg-blue-50 border-blue-200 font-bold text-blue-900"
          : "bg-gray-100 border-gray-300 font-semibold"
      }`}
    >
      <td className="px-4 py-4 border-t-2">{label}</td>
      <td className="px-4 py-4 border-t-2 text-green-600">
        {formatCurrency(totalRevenue)}
      </td>
      <td className="px-4 py-4 border-t-2 text-red-600">
        {formatCurrency(totalExpenses)}
      </td>
      <td className="px-4 py-4 border-t-2">
        <div className="flex flex-col">
          <span
            className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}
          >
            {formatCurrency(totalProfit)}
          </span>
          {averageMonthlyProfit && (
            <span className="text-sm text-gray-600">
              متوسط: {formatCurrency(averageMonthlyProfit)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 border-t-2">
        <span
          className={
            profitMargin >= 30
              ? "text-green-600"
              : profitMargin >= 15
              ? "text-yellow-600"
              : "text-red-600"
          }
        >
          {formatPercentage(profitMargin)}
        </span>
      </td>
    </tr>
  );
};

const ProfitLossTable = ({ data, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profitTrendData = data?.data?.profitTrend || [];

  // Sort data if needed
  let sortedData = [...profitTrendData];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Find best and worst performing months
  const bestMonth =
    profitTrendData.length > 0
      ? profitTrendData.reduce(
          (maxIdx, item, idx, arr) =>
            item.profit > arr[maxIdx].profit ? idx : maxIdx,
          0
        )
      : null;

  const worstMonth =
    profitTrendData.length > 0
      ? profitTrendData.reduce(
          (minIdx, item, idx, arr) =>
            item.profit < arr[minIdx].profit ? idx : minIdx,
          0
        )
      : null;

  const exportToCSV = () => {
    const csvData = [
      ["الشهر", "الإيرادات", "المصروفات", "الربح الصافي", "نسبة الربح"],
      ...sortedData.map((row) => [
        `${row.monthName} ${row.year}`,
        row.revenue,
        row.expenses,
        row.profit,
        row.profitMargin,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profit-loss-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaTable className="text-blue-600" />
          جدول الأرباح والخسائر التفصيلي
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaFilter />
            فلتر
          </button>

          <button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaDownload />
            تصدير CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فلترة بالربح
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                <option value="positive">ربح موجب</option>
                <option value="negative">خسارة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                هامش الربح
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                <option value="high">عالي (30%+)</option>
                <option value="medium">متوسط (15-30%)</option>
                <option value="low">منخفض (&lt;15%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السنة
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">الكل</option>
                {[...new Set(profitTrendData.map((item) => item.year))].map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <TableHeader
                label="الشهر"
                sortKey="month"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="الإيرادات"
                sortKey="revenue"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="المصروفات"
                sortKey="expenses"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="الربح الصافي"
                sortKey="profit"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="نسبة الربح"
                sortKey="profitMargin"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => {
              const originalIndex = profitTrendData.findIndex(
                (original) =>
                  original.month === item.month && original.year === item.year
              );
              return (
                <TableRow
                  key={`${item.year}-${item.month}`}
                  data={item}
                  index={originalIndex}
                  bestMonth={bestMonth}
                  worstMonth={worstMonth}
                />
              );
            })}

            {/* Summary Row */}
            <SummaryRow
              data={data?.data}
              label="الإجمالي السنوي"
              isTotal={true}
            />
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FaTable className="mx-auto text-4xl mb-4 opacity-50" />
          <p>لا توجد بيانات للعرض</p>
        </div>
      )}

      {/* Legend */}
      {sortedData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>أفضل شهر</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
              <span>أسوأ شهر</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              <span>هامش ربح عالي (30%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span>هامش ربح متوسط (15-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span>هامش ربح منخفض (&lt;15%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitLossTable;
