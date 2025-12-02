const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

// Pages API functions

// Get all pages (admin)
export const getAllPages = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        searchParams.append(key, params[key]);
      }
    });

    const query = searchParams.toString() ? `?${searchParams}` : "";
    const response = await apiRequest(`/pages${query}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error fetching pages:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get page by slug (public)
export const getPageBySlug = async (slug) => {
  try {
    const response = await apiRequest(`/pages/${slug}`);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error fetching page:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create new page (admin)
export const createPage = async (pageData) => {
  try {
    const response = await apiRequest("/pages", {
      method: "POST",
      body: JSON.stringify(pageData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update page (admin)
export const updatePage = async (pageId, pageData) => {
  try {
    const response = await apiRequest(`/pages/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(pageData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete page (admin)
export const deletePage = async (pageId) => {
  try {
    const response = await apiRequest(`/pages/${pageId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update hero section (admin)
export const updatePageHero = async (pageId, heroData) => {
  try {
    const response = await apiRequest(`/pages/${pageId}/hero`, {
      method: "PUT",
      body: JSON.stringify(heroData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating hero:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update featured items (admin)
export const updateFeaturedItems = async (pageId, featuredItems) => {
  try {
    const response = await apiRequest(`/pages/${pageId}/featured-items`, {
      method: "PUT",
      body: JSON.stringify({ featuredItems }),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating featured items:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update featured reviews (admin)
export const updateFeaturedReviews = async (pageId, featuredReviews) => {
  try {
    const response = await apiRequest(`/pages/${pageId}/featured-reviews`, {
      method: "PUT",
      body: JSON.stringify({ featuredReviews }),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating featured reviews:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Branches API functions

// Get all branches (public)
export const getAllBranches = async () => {
  try {
    const response = await apiRequest("/branches");
    return {
      success: true,
      data: response,
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
export const getBranchById = async (branchId) => {
  try {
    const response = await apiRequest(`/branches/${branchId}`);
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

// Create branch (admin)
export const createBranch = async (branchData) => {
  try {
    const response = await apiRequest("/branches", {
      method: "POST",
      body: JSON.stringify(branchData),
    });

    return {
      success: true,
      data: response,
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
export const updateBranch = async (branchId, branchData) => {
  try {
    const response = await apiRequest(`/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(branchData),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error updating branch:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete branch (admin)
export const deleteBranch = async (branchId) => {
  try {
    const response = await apiRequest(`/branches/${branchId}`, {
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
