import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as profitLossService from "../services/profitLossService";

// Date utility functions
const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
};

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    startDate: formatDate(firstDayOfMonth),
    endDate: formatDate(today),
  };
};

const getPreviousPeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();

  const previousEnd = new Date(start.getTime() - 1); // One day before start
  const previousStart = new Date(previousEnd.getTime() - diff);

  return {
    previousPeriodStart: formatDate(previousStart),
    previousPeriodEnd: formatDate(previousEnd),
  };
};

// Custom hook for financial summary
export const useFinancialSummary = (dateRange = null) => {
  const defaultRange = getDefaultDateRange();
  const finalRange = dateRange || defaultRange;
  const previousPeriod = getPreviousPeriod(
    finalRange.startDate,
    finalRange.endDate
  );

  const params = {
    ...finalRange,
    ...previousPeriod,
  };

  return useQuery({
    queryKey: ["financial-summary", params],
    queryFn: () => profitLossService.getFinancialSummary(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for revenue vs expenses
export const useRevenueVsExpenses = (period = "monthly", dateRange = null) => {
  const defaultRange = getDefaultDateRange();
  const finalRange = dateRange || defaultRange;

  const params = {
    ...finalRange,
    period,
  };

  return useQuery({
    queryKey: ["revenue-vs-expenses", params],
    queryFn: () => profitLossService.getRevenueVsExpenses(params),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Custom hook for revenue breakdown
export const useRevenueBreakdown = (dateRange = null) => {
  const defaultRange = getDefaultDateRange();
  const finalRange = dateRange || defaultRange;

  return useQuery({
    queryKey: ["revenue-breakdown", finalRange],
    queryFn: () => profitLossService.getRevenueBreakdown(finalRange),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Custom hook for expense breakdown
export const useExpenseBreakdown = () => {
  return useQuery({
    queryKey: ["expense-breakdown"],
    queryFn: profitLossService.getExpenseBreakdown,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Custom hook for profit trend
export const useProfitTrend = (months = 12) => {
  return useQuery({
    queryKey: ["profit-trend", months],
    queryFn: () => profitLossService.getProfitTrend({ months }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Main hook that combines all profit-loss data
export const useProfitLoss = () => {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [trendMonths, setTrendMonths] = useState(12);

  // All data hooks
  const financialSummary = useFinancialSummary(dateRange);
  const revenueVsExpenses = useRevenueVsExpenses(chartPeriod, dateRange);
  const revenueBreakdown = useRevenueBreakdown(dateRange);
  const expenseBreakdown = useExpenseBreakdown();
  const profitTrend = useProfitTrend(trendMonths);

  // Combined loading and error states
  const isLoading =
    financialSummary.isLoading ||
    revenueVsExpenses.isLoading ||
    revenueBreakdown.isLoading ||
    expenseBreakdown.isLoading ||
    profitTrend.isLoading;

  const isError =
    financialSummary.isError ||
    revenueVsExpenses.isError ||
    revenueBreakdown.isError ||
    expenseBreakdown.isError ||
    profitTrend.isError;

  const error =
    financialSummary.error ||
    revenueVsExpenses.error ||
    revenueBreakdown.error ||
    expenseBreakdown.error ||
    profitTrend.error;

  // Refresh all data
  const refetchAll = () => {
    financialSummary.refetch();
    revenueVsExpenses.refetch();
    revenueBreakdown.refetch();
    expenseBreakdown.refetch();
    profitTrend.refetch();
  };

  return {
    // Data
    financialSummary: financialSummary.data,
    revenueVsExpenses: revenueVsExpenses.data,
    revenueBreakdown: revenueBreakdown.data,
    expenseBreakdown: expenseBreakdown.data,
    profitTrend: profitTrend.data,

    // Loading and error states
    isLoading,
    isError,
    error,

    // Controls
    dateRange,
    setDateRange,
    chartPeriod,
    setChartPeriod,
    trendMonths,
    setTrendMonths,

    // Actions
    refetchAll,

    // Individual query states (for specific loading states)
    queries: {
      financialSummary,
      revenueVsExpenses,
      revenueBreakdown,
      expenseBreakdown,
      profitTrend,
    },
  };
};

// Utility functions for components
export const formatCurrency = (amount, currency = "EGP") => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (percentage, decimals = 1) => {
  return `${percentage.toFixed(decimals)}%`;
};

export const getTrendColor = (trend) => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export const getTrendIcon = (trend) => {
  switch (trend) {
    case "up":
      return "↗";
    case "down":
      return "↘";
    default:
      return "→";
  }
};
