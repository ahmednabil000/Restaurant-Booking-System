import React, { useState } from "react";
import {
  FaChartBar,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryLegend,
  VictoryArea,
  VictoryContainer,
  VictoryGroup,
} from "victory";
import { formatCurrency } from "../../../hooks/useProfitLoss";

const ChartTypeToggle = ({ chartType, setChartType }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
      <button
        onClick={() => setChartType("bar")}
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 font-medium ${
          chartType === "bar"
            ? "bg-white text-blue-600 shadow-sm border border-blue-200"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        }`}
      >
        <FaChartBar />
        أعمدة
      </button>
      <button
        onClick={() => setChartType("line")}
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 font-medium ${
          chartType === "line"
            ? "bg-white text-blue-600 shadow-sm border border-blue-200"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        }`}
      >
        <FaChartLine />
        خط
      </button>
    </div>
  );
};

const VictoryBarChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FaChartBar className="mx-auto text-4xl mb-4 opacity-50" />
          <p className="text-lg">لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  // Transform data for Victory - Create separate datasets for revenue and expenses
  const revenueData = chartData.map((item, index) => ({
    x: item.period || `الشهر ${index + 1}`,
    y: item.revenue || 0,
    label: `${item.period || `الشهر ${index + 1}`}\nالإيرادات: ${formatCurrency(
      item.revenue || 0
    )}`,
  }));

  const expensesData = chartData.map((item, index) => ({
    x: item.period || `الشهر ${index + 1}`,
    y: item.expenses || 0,
    label: `${item.period || `الشهر ${index + 1}`}\nالمصروفات: ${formatCurrency(
      item.expenses || 0
    )}`,
  }));

  // Calculate max value for better domain setting
  const maxRevenue = Math.max(...revenueData.map((d) => d.y));
  const maxExpenses = Math.max(...expensesData.map((d) => d.y));
  const maxValue = Math.max(maxRevenue, maxExpenses);
  const yDomainMax = maxValue * 1.1; // Add 10% padding

  return (
    <div className="h-[500px] w-full">
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 40, y: [0, yDomainMax * 0.1] }}
        padding={{ left: 100, top: 50, right: 80, bottom: 120 }}
        height={480}
        width={800}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        {/* Y-Axis with better formatting */}
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => {
            if (t >= 1000000) return `${(t / 1000000).toFixed(1)}م`;
            if (t >= 1000) return `${(t / 1000).toFixed(0)}ك`;
            return t.toFixed(0);
          }}
          style={{
            tickLabels: {
              fontSize: 14,
              padding: 5,
              fill: "#4b5563",
              fontFamily: "Cairo, sans-serif",
            },
            grid: { stroke: "#f3f4f6", strokeWidth: 1 },
            axis: { stroke: "#e5e7eb", strokeWidth: 1 },
          }}
        />

        {/* X-Axis with rotated labels */}
        <VictoryAxis
          style={{
            tickLabels: {
              fontSize: 12,
              padding: 5,
              fill: "#4b5563",
              angle: -45,
              textAnchor: "end",
              fontFamily: "Cairo, sans-serif",
            },
            axis: { stroke: "#e5e7eb", strokeWidth: 1 },
          }}
        />

        {/* Grouped bars for revenue and expenses */}
        <VictoryGroup offset={20} colorScale={["#10b981", "#ef4444"]}>
          <VictoryBar
            data={revenueData}
            style={{
              data: {
                fill: "#10b981",
                fillOpacity: 0.9,
                stroke: "#059669",
                strokeWidth: 1,
                cursor: "pointer",
              },
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 },
            }}
            labelComponent={
              <VictoryTooltip
                style={{
                  fontSize: 12,
                  fill: "white",
                  fontFamily: "Cairo, sans-serif",
                }}
                flyoutStyle={{
                  stroke: "#059669",
                  strokeWidth: 1,
                  fill: "#10b981",
                }}
                cornerRadius={4}
                pointerLength={5}
              />
            }
          />

          <VictoryBar
            data={expensesData}
            style={{
              data: {
                fill: "#ef4444",
                fillOpacity: 0.9,
                stroke: "#dc2626",
                strokeWidth: 1,
                cursor: "pointer",
              },
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 },
            }}
            labelComponent={
              <VictoryTooltip
                style={{
                  fontSize: 12,
                  fill: "white",
                  fontFamily: "Cairo, sans-serif",
                }}
                flyoutStyle={{
                  stroke: "#dc2626",
                  strokeWidth: 1,
                  fill: "#ef4444",
                }}
                cornerRadius={4}
                pointerLength={5}
              />
            }
          />
        </VictoryGroup>

        {/* Enhanced Legend */}
        <VictoryLegend
          x={150}
          y={30}
          orientation="horizontal"
          gutter={30}
          style={{
            border: { stroke: "transparent" },
            labels: {
              fontSize: 14,
              fill: "#374151",
              fontFamily: "Cairo, sans-serif",
              fontWeight: "500",
            },
          }}
          data={[
            { name: "الإيرادات", symbol: { fill: "#10b981", type: "square" } },
            { name: "المصروفات", symbol: { fill: "#ef4444", type: "square" } },
          ]}
        />
      </VictoryChart>
    </div>
  );
};

const VictoryLineChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FaChartLine className="mx-auto text-4xl mb-4 opacity-50" />
          <p className="text-lg">لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  // Transform data for Victory with better period handling
  const revenueData = chartData.map((item, index) => ({
    x: index + 1,
    y: item.revenue || 0,
    label: `${item.period || `الشهر ${index + 1}`}\nالإيرادات: ${formatCurrency(
      item.revenue || 0
    )}`,
  }));

  const expensesData = chartData.map((item, index) => ({
    x: index + 1,
    y: item.expenses || 0,
    label: `${item.period || `الشهر ${index + 1}`}\nالمصروفات: ${formatCurrency(
      item.expenses || 0
    )}`,
  }));

  const profitData = chartData.map((item, index) => {
    const profit = (item.revenue || 0) - (item.expenses || 0);
    return {
      x: index + 1,
      y: profit,
      label: `${
        item.period || `الشهر ${index + 1}`
      }\nالربح الصافي: ${formatCurrency(profit)}`,
    };
  });

  const categories = chartData.map(
    (item, index) => item.period || `الشهر ${index + 1}`
  );

  // Calculate domain for better chart display
  const allValues = [
    ...revenueData.map((d) => d.y),
    ...expensesData.map((d) => d.y),
    ...profitData.map((d) => d.y),
  ];
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="h-[500px] w-full">
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [minValue - padding, maxValue + padding] }}
        padding={{ left: 100, top: 50, right: 80, bottom: 120 }}
        height={480}
        width={800}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        {/* Y-Axis with better formatting */}
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => {
            if (t >= 1000000) return `${(t / 1000000).toFixed(1)}م`;
            if (t >= 1000) return `${(t / 1000).toFixed(0)}ك`;
            return t.toFixed(0);
          }}
          style={{
            tickLabels: {
              fontSize: 14,
              padding: 5,
              fill: "#4b5563",
              fontFamily: "Cairo, sans-serif",
            },
            grid: { stroke: "#f3f4f6", strokeWidth: 1 },
            axis: { stroke: "#e5e7eb", strokeWidth: 1 },
          }}
        />

        {/* X-Axis with category labels */}
        <VictoryAxis
          tickFormat={() => ""}
          tickLabelComponent={() => null}
          style={{
            axis: { stroke: "#e5e7eb", strokeWidth: 1 },
          }}
        />

        {/* Profit Area (background) */}
        <VictoryArea
          data={profitData}
          style={{
            data: {
              fill: "#3b82f6",
              fillOpacity: 0.15,
              stroke: "#2563eb",
              strokeWidth: 2,
            },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          labelComponent={
            <VictoryTooltip
              style={{
                fontSize: 12,
                fill: "white",
                fontFamily: "Cairo, sans-serif",
              }}
              flyoutStyle={{
                stroke: "#2563eb",
                strokeWidth: 1,
                fill: "#3b82f6",
              }}
              cornerRadius={4}
              pointerLength={5}
            />
          }
        />

        {/* Revenue Line */}
        <VictoryLine
          data={revenueData}
          style={{
            data: {
              stroke: "#10b981",
              strokeWidth: 4,
              strokeLinecap: "round",
            },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          labelComponent={
            <VictoryTooltip
              style={{
                fontSize: 12,
                fill: "white",
                fontFamily: "Cairo, sans-serif",
              }}
              flyoutStyle={{
                stroke: "#059669",
                strokeWidth: 1,
                fill: "#10b981",
              }}
              cornerRadius={4}
              pointerLength={5}
            />
          }
        />

        {/* Expenses Line */}
        <VictoryLine
          data={expensesData}
          style={{
            data: {
              stroke: "#ef4444",
              strokeWidth: 4,
              strokeLinecap: "round",
            },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          labelComponent={
            <VictoryTooltip
              style={{
                fontSize: 12,
                fill: "white",
                fontFamily: "Cairo, sans-serif",
              }}
              flyoutStyle={{
                stroke: "#dc2626",
                strokeWidth: 1,
                fill: "#ef4444",
              }}
              cornerRadius={4}
              pointerLength={5}
            />
          }
        />

        {/* Enhanced Legend */}
        <VictoryLegend
          x={150}
          y={30}
          orientation="horizontal"
          gutter={25}
          style={{
            border: { stroke: "transparent" },
            labels: {
              fontSize: 14,
              fill: "#374151",
              fontFamily: "Cairo, sans-serif",
              fontWeight: "500",
            },
          }}
          data={[
            {
              name: "الإيرادات",
              symbol: { fill: "#10b981", type: "line", strokeWidth: 4 },
            },
            {
              name: "المصروفات",
              symbol: { fill: "#ef4444", type: "line", strokeWidth: 4 },
            },
            {
              name: "الربح الصافي",
              symbol: { fill: "#3b82f6", type: "square" },
            },
          ]}
        />
      </VictoryChart>

      {/* Custom X-axis labels outside the chart */}
      <div className="flex justify-between px-16 -mt-4 text-sm text-gray-600">
        {categories.map((category, index) => (
          <span
            key={index}
            className="text-center"
            style={{ width: `${100 / categories.length}%` }}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

const SummaryStats = ({ data, chartData }) => {
  // Don't show summary if there's no chart data or no summary data
  if (!data?.summary || !chartData || chartData.length === 0) {
    return null;
  }

  const { totalRevenue, totalExpenses, totalProfit } = data.summary;

  // Additional check: if all summary values are zero or null, don't show
  if (!totalRevenue && !totalExpenses && !totalProfit) {
    return null;
  }

  const profitPercentage =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const isProfit = totalProfit >= 0;
  const changeIcon = isProfit ? FaArrowUp : FaArrowDown;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium mb-1">
              إجمالي الإيرادات
            </p>
            <p className="text-2xl font-bold text-green-700 mb-2">
              {formatCurrency(totalRevenue)}
            </p>
            <div className="flex items-center text-sm text-green-600">
              <FaArrowUp className="mr-1" />
              <span>مقارنة بالفترة السابقة</span>
            </div>
          </div>
          <div className="bg-green-500 p-4 rounded-full shadow-lg">
            <FaArrowUp className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium mb-1">
              إجمالي المصروفات
            </p>
            <p className="text-2xl font-bold text-red-700 mb-2">
              {formatCurrency(totalExpenses)}
            </p>
            <div className="flex items-center text-sm text-red-600">
              <FaArrowDown className="mr-1" />
              <span>مقارنة بالفترة السابقة</span>
            </div>
          </div>
          <div className="bg-red-500 p-4 rounded-full shadow-lg">
            <FaArrowDown className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Net Profit Card */}
      <div
        className={`bg-gradient-to-br ${
          isProfit
            ? "from-blue-50 to-blue-100 border-blue-200"
            : "from-orange-50 to-orange-100 border-orange-200"
        } p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium mb-1 ${
                isProfit ? "text-blue-600" : "text-orange-600"
              }`}
            >
              {isProfit ? "الربح الصافي" : "الخسارة الصافية"}
            </p>
            <p
              className={`text-2xl font-bold mb-2 ${
                isProfit ? "text-blue-700" : "text-orange-700"
              }`}
            >
              {formatCurrency(Math.abs(totalProfit))}
            </p>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center text-sm ${
                  isProfit ? "text-blue-600" : "text-orange-600"
                }`}
              >
                {React.createElement(changeIcon, { className: "mr-1" })}
                <span>{Math.abs(profitPercentage).toFixed(1)}% هامش</span>
              </div>
            </div>
          </div>
          <div
            className={`${
              isProfit ? "bg-blue-500" : "bg-orange-500"
            } p-4 rounded-full shadow-lg`}
          >
            {React.createElement(changeIcon, {
              className: "text-white text-xl",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const RevenueVsExpensesChart = ({ data, isLoading, period }) => {
  const [chartType, setChartType] = useState("bar");
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const chartData = data?.data?.chartData || [];

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const containerClasses = isFullScreen
    ? "fixed inset-0 z-50 bg-white p-8 overflow-auto"
    : "bg-white rounded-xl shadow-lg p-8";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaChartBar className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              الإيرادات مقابل المصروفات
            </h3>
            {period && (
              <span className="text-sm text-gray-500 font-medium">
                التقرير{" "}
                {period === "daily"
                  ? "اليومي"
                  : period === "weekly"
                  ? "الأسبوعي"
                  : period === "monthly"
                  ? "الشهري"
                  : "السنوي"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ChartTypeToggle chartType={chartType} setChartType={setChartType} />

          <button
            onClick={handleFullScreen}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-800 font-medium"
          >
            {isFullScreen ? (
              <>
                <FaCompress />
                تصغير
              </>
            ) : (
              <>
                <FaExpand />
                ملء الشاشة
              </>
            )}
          </button>
        </div>
      </div>

      <SummaryStats data={data?.data} chartData={chartData} />

      {/* Legend - only show when there's data */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-8 text-sm bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm shadow-sm"></div>
              <span className="font-medium text-gray-700">الإيرادات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm shadow-sm"></div>
              <span className="font-medium text-gray-700">المصروفات</span>
            </div>
            {chartType === "line" && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-sm"></div>
                <span className="font-medium text-gray-700">الربح الصافي</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 ? (
        <div
          className={`transition-all duration-300 ${
            isFullScreen ? "h-[600px]" : "h-[500px]"
          }`}
        >
          {chartType === "bar" ? (
            <VictoryBarChart chartData={chartData} />
          ) : (
            <VictoryLineChart chartData={chartData} />
          )}
        </div>
      ) : (
        /* No Data State */
        <div className="text-center py-16 text-gray-500">
          <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <FaChartBar className="text-4xl opacity-50" />
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">
            لا توجد بيانات متاحة
          </h4>
          <p className="text-gray-500">
            لا توجد بيانات للفترة المحددة. يرجى تجربة فترة زمنية مختلفة.
          </p>
        </div>
      )}

      {/* Close button for fullscreen */}
      {isFullScreen && (
        <button
          onClick={handleFullScreen}
          className="fixed top-6 right-6 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-colors shadow-lg z-10"
        >
          <FaCompress className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default RevenueVsExpensesChart;
