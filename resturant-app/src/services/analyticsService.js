// Analytics API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

export const getReservationStats = async (period = "day") => {
  try {
    const params = new URLSearchParams({ period });
    const res = await fetch(
      `${API_BASE_URL}/analytics/reservation-stats?${params.toString()}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching reservation stats:", error);
    throw error;
  }
};

export const getMostDemandedMeals = async (limit = 10, period = "month") => {
  try {
    const params = new URLSearchParams({ limit: String(limit), period });
    const res = await fetch(
      `${API_BASE_URL}/analytics/most-demanded-meals?${params.toString()}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching most demanded meals:", error);
    throw error;
  }
};

export const getRecentCustomers = async (limit = 20, days = 30) => {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      days: String(days),
    });
    const res = await fetch(
      `${API_BASE_URL}/analytics/recent-customers?${params.toString()}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching recent customers:", error);
    throw error;
  }
};

export default {
  getReservationStats,
  getMostDemandedMeals,
  getRecentCustomers,
};
