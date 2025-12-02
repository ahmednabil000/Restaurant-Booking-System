// Tags API service functions
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

// Get all tags
export const getTags = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "GET",
      headers: buildHeaders(false), // Public endpoint
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// Alias for backwards compatibility
export const getAllTags = getTags;

// Create new tag
export const createTag = async (tagData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/create`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(tagData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Update tag
export const updateTag = async (tagId, tagData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(tagData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw error;
  }
};

// Delete tag
export const deleteTag = async (tagId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: "DELETE",
      headers: buildHeaders(true),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};

// Get meals by tag
export const getMealsByTags = async (tagIds) => {
  try {
    const tagsParam = Array.isArray(tagIds) ? tagIds.join(" ") : tagIds;
    const response = await fetch(
      `${API_BASE_URL}/tags/meals?tags=${encodeURIComponent(tagsParam)}`,
      {
        method: "GET",
        headers: buildHeaders(false), // Public endpoint
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meals by tags:", error);
    throw error;
  }
};

// Remove tag from meal
export const removeTagFromMeal = async (mealId, tagId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tags/meals/${mealId}/${tagId}`,
      {
        method: "DELETE",
        headers: buildHeaders(true),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing tag from meal:", error);
    throw error;
  }
};

export default {
  getTags,
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getMealsByTags,
  removeTagFromMeal,
};
