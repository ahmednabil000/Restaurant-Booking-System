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

// Get all roles
export const getRoles = async (includeInactive = false) => {
  try {
    const queryString = includeInactive ? "?includeInactive=true" : "";
    return await apiCall(`/api/roles${queryString}`);
  } catch (error) {
    throw new Error(error.message || "Error fetching roles");
  }
};

// Get role by ID
export const getRoleById = async (id) => {
  try {
    return await apiCall(`/api/roles/${id}`);
  } catch (error) {
    throw new Error(error.message || "Error fetching role");
  }
};

// Create new role
export const createRole = async (roleData) => {
  try {
    return await apiCall("/api/roles", {
      method: "POST",
      body: JSON.stringify(roleData),
    });
  } catch (error) {
    throw new Error(error.message || "Error creating role");
  }
};

// Update role
export const updateRole = async (id, roleData) => {
  try {
    return await apiCall(`/api/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    });
  } catch (error) {
    throw new Error(error.message || "Error updating role");
  }
};

// Delete role
export const deleteRole = async (id) => {
  try {
    return await apiCall(`/api/roles/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message || "Error deleting role");
  }
};
