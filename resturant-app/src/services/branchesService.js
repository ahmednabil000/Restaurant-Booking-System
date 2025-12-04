import { API_BASE_URL } from "../config/api";
const API_URL = API_BASE_URL;

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
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

// Branches API functions

// Get all branches (public)
export const getAllBranches = async () => {
  try {
    const response = await apiRequest("/branches");
    return {
      success: true,
      data: Array.isArray(response) ? response : response.data || [],
    };
  } catch (error) {
    console.error("Error fetching branches:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get branch by ID (public)
export const getBranchById = async (id) => {
  try {
    const response = await apiRequest(`/branches/${id}`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error fetching branch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Search branches (public)
export const searchBranches = async (searchParams) => {
  try {
    const params = new URLSearchParams();
    if (searchParams.city) params.append("city", searchParams.city);
    if (searchParams.state) params.append("state", searchParams.state);
    if (searchParams.country) params.append("country", searchParams.country);
    if (searchParams.search) params.append("search", searchParams.search);

    const queryString = params.toString();
    const endpoint = `/branches/search${queryString ? `?${queryString}` : ""}`;

    const response = await apiRequest(endpoint);
    return {
      success: true,
      data: Array.isArray(response) ? response : response.data || [],
    };
  } catch (error) {
    console.error("Error searching branches:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create new branch (admin)
export const createBranch = async (branchData) => {
  try {
    const response = await apiRequest("/branches", {
      method: "POST",
      body: JSON.stringify(branchData),
    });

    return {
      success: true,
      data: response.branch || response.data || response,
    };
  } catch (error) {
    console.error("Error creating branch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update branch (admin)
export const updateBranch = async (id, branchData) => {
  try {
    const response = await apiRequest(`/branches/${id}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    });

    return {
      success: true,
      data: response.branch || response.data || response,
    };
  } catch (error) {
    console.error("Error updating branch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update branch location (admin)
export const updateBranchLocation = async (id, locationData) => {
  try {
    const response = await apiRequest(`/branches/${id}/location`, {
      method: "PUT",
      body: JSON.stringify(locationData),
    });

    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    console.error("Error updating branch location:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete branch (admin)
export const deleteBranch = async (id) => {
  try {
    const response = await apiRequest(`/branches/${id}`, {
      method: "DELETE",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error deleting branch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Bulk operations
export const bulkUpdateBranches = async (branchIds, updateData) => {
  try {
    const updatePromises = branchIds.map((id) => updateBranch(id, updateData));
    const results = await Promise.all(updatePromises);

    const failedUpdates = results.filter((result) => !result.success);

    return {
      success: failedUpdates.length === 0,
      data: {
        updated: results.filter((result) => result.success).length,
        failed: failedUpdates.length,
        errors: failedUpdates.map((result) => result.error),
      },
    };
  } catch (error) {
    console.error("Error in bulk branch update:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const toggleBranchStatus = async (id) => {
  try {
    // First get the current branch data
    const branchResponse = await getBranchById(id);
    if (!branchResponse.success) {
      return branchResponse;
    }

    // Toggle the isActive status
    const updatedBranch = {
      ...branchResponse.data,
      isActive: !branchResponse.data.isActive,
    };

    // Update the branch
    return await updateBranch(id, updatedBranch);
  } catch (error) {
    console.error("Error toggling branch status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
