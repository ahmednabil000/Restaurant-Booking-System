import { API_BASE_URL } from "../config/api";
const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

// Helper function to make API calls with auth
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("المصادقة مطلوبة. يرجى تسجيل الدخول أولاً.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      throw new Error(
        "انتهت صلاحية جلسة المصادقة. يرجى تسجيل الدخول مرة أخرى."
      );
    }

    if (response.status === 403) {
      throw new Error("ليس لديك صلاحية للوصول إلى هذه الميزة.");
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/users${queryString ? `?${queryString}` : ""}`;
    return await apiCall(endpoint);
  } catch (error) {
    throw new Error(error.message || "Error fetching users");
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    return await apiCall(`/api/users/${id}`);
  } catch (error) {
    throw new Error(error.message || "Error fetching user");
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    return await apiCall("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    return await apiCall(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    throw new Error(error.message || "Error updating user");
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    return await apiCall(`/api/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message || "Error deleting user");
  }
};

// Assign role to user
export const assignRole = async (userId, role) => {
  try {
    return await apiCall(`/api/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  } catch (error) {
    throw new Error(error.message || "Error assigning role");
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    return await apiCall("/api/users/stats");
  } catch (error) {
    throw new Error(error.message || "Error fetching user statistics");
  }
};
