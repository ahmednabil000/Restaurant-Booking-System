import React from "react";
import {
  FaMoneyBillWave,
  FaCalculator,
  FaChartLine,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";
import { formatCurrency } from "../../../hooks/useProfitLoss";

const FinancialSummaryCard = ({
  title,
  value,
  changePercentage,
  trend,
  icon: Icon,
  iconColor,
  isLoading,
  suffix = "",
}) => {
  const getTrendIconComponent = (trendDirection) => {
    switch (trendDirection) {
      case "up":
        return <FaArrowUp className="text-green-500" />;
      case "down":
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getTrendColorClass = (trendDirection) => {
    switch (trendDirection) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className={`h-8 w-8 bg-gray-200 rounded-full`}></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${iconColor}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? formatCurrency(value) : value}
          {suffix}
        </span>
      </div>

      {changePercentage !== undefined && changePercentage !== null && (
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColorClass(
              trend
            )}`}
          >
            {getTrendIconComponent(trend)}
            <span>{Math.abs(changePercentage).toFixed(1)}%</span>
          </div>
          <span className="text-gray-500 text-xs">مقارنة بالفترة السابقة</span>
        </div>
      )}
    </div>
  );
};

const FinancialSummaryCards = ({ data, isLoading }) => {
  const financialData = data?.data || {};

  const cards = [
    {
      title: "إجمالي الإيرادات",
      value: financialData.totalRevenue?.amount || 0,
      changePercentage: financialData.totalRevenue?.changePercentage,
      trend: financialData.totalRevenue?.trend || "neutral",
      icon: FaMoneyBillWave,
      iconColor: "bg-green-500",
    },
    {
      title: "إجمالي المصروفات",
      value: financialData.totalExpenses?.amount || 0,
      changePercentage: financialData.totalExpenses?.changePercentage,
      trend: financialData.totalExpenses?.trend || "neutral",
      icon: FaCalculator,
      iconColor: "bg-red-500",
    },
    {
      title: "الربح الصافي",
      value: financialData.netProfit?.amount || 0,
      changePercentage: financialData.netProfit?.changePercentage,
      trend: financialData.netProfit?.trend || "neutral",
      icon: FaChartLine,
      iconColor: "bg-blue-500",
    },
    {
      title: "هامش الربح",
      value: financialData.profitMargin?.percentage || 0,
      changePercentage: financialData.profitMargin?.changePercentage,
      trend: financialData.profitMargin?.trend || "neutral",
      icon: FaPercentage,
      iconColor: "bg-purple-500",
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <FinancialSummaryCard
          key={index}
          title={card.title}
          value={card.value}
          changePercentage={card.changePercentage}
          trend={card.trend}
          icon={card.icon}
          iconColor={card.iconColor}
          isLoading={isLoading}
          suffix={card.suffix}
        />
      ))}
    </div>
  );
};

export default FinancialSummaryCards;
