const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  console.log(
    "Retrieved auth token:",
    token ? "Token found" : "No token found"
  );
  return token ? `Bearer ${token}` : null;
};

// Helper function for API requests with authentication
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage =
        errorJson.message || errorJson.error || `HTTP ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
};

// Working Days API functions

// Get all working days
export const getAllWorkingDays = async () => {
  try {
    console.log("Making API request to:", `${API_URL}/restaurant/working-days`);
    const response = await apiRequest("/restaurant/working-days");
    console.log("API response received:", response);
    return {
      success: true,
      data: response.data || response, // Handle both response.data and direct response
    };
  } catch (error) {
    console.error("Error fetching working days:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get working day by ID
export const getWorkingDayById = async (id) => {
  try {
    const response = await apiRequest(`/restaurant/working-days/${id}`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error fetching working day:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create new working day
export const createWorkingDay = async (workingDayData) => {
  try {
    const response = await apiRequest("/restaurant/working-days", {
      method: "POST",
      body: JSON.stringify(workingDayData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error creating working day:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update working day
export const updateWorkingDay = async (id, workingDayData) => {
  try {
    const response = await apiRequest(`/restaurant/working-days/${id}`, {
      method: "PUT",
      body: JSON.stringify(workingDayData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating working day:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Bulk update working days
export const bulkUpdateWorkingDays = async (workingDays) => {
  try {
    const response = await apiRequest("/restaurant/working-days/bulk", {
      method: "PUT",
      body: JSON.stringify({ workingDays }),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error bulk updating working days:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Toggle working day status
export const toggleWorkingDay = async (id) => {
  try {
    const response = await apiRequest(`/restaurant/working-days/${id}/toggle`, {
      method: "PATCH",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error toggling working day:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete working day
export const deleteWorkingDay = async (id) => {
  try {
    const response = await apiRequest(`/restaurant/working-days/${id}`, {
      method: "DELETE",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error deleting working day:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
