// Profit & Loss API service functions
import { API_BASE_URL } from "../config/api";

const getAuthToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

const buildHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Build query parameters helper
const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

/**
 * Get financial summary cards data
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 * @param {string} params.previousPeriodStart - Previous period start date
 * @param {string} params.previousPeriodEnd - Previous period end date
 */
export const getFinancialSummary = async (params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_BASE_URL}/profit-loss/financial-summary${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    throw error;
  }
};

/**
 * Get revenue vs expenses chart data
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 * @param {string} params.period - Aggregation period (daily, weekly, monthly, yearly)
 */
export const getRevenueVsExpenses = async (params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_BASE_URL}/profit-loss/revenue-vs-expenses${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching revenue vs expenses data:", error);
    throw error;
  }
};

/**
 * Get revenue breakdown by meals and categories
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 */
export const getRevenueBreakdown = async (params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_BASE_URL}/profit-loss/revenue-breakdown${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching revenue breakdown:", error);
    throw error;
  }
};

/**
 * Get expense breakdown (employee salaries)
 */
export const getExpenseBreakdown = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/profit-loss/expense-breakdown`, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching expense breakdown:", error);
    throw error;
  }
};

/**
 * Get profit trend analysis
 * @param {Object} params - Query parameters
 * @param {number} params.months - Number of months to analyze (default: 12)
 */
export const getProfitTrend = async (params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_BASE_URL}/profit-loss/profit-trend${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profit trend:", error);
    throw error;
  }
};
