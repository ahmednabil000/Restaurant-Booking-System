// Meals API service functions
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

// Get meals with pagination and filters
export const getMeals = async ({
  page = 1,
  pageSize = 10,
  category,
  type,
  isAvailable,
  minPrice,
  maxPrice,
  search,
  sortBy,
  sortOrder,
  tags,
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    // Add optional parameters only if they have values
    if (category) params.append("category", category);
    if (type) params.append("type", type);
    if (isAvailable !== undefined)
      params.append("isAvailable", isAvailable.toString());
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (tags && tags.length > 0) {
      // Handle multiple tags - send as comma-separated or multiple params
      tags.forEach((tag) => params.append("tags", tag));
    }

    const response = await fetch(`${API_BASE_URL}/meals?${params.toString()}`, {
      method: "GET",
      headers: buildHeaders(false), // Public endpoint
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Return the data object containing meals and pagination
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw error;
  }
};

// Get meals by tags using the /tags/meals endpoint
export const getMealsByTags = async (
  tagIds,
  {
    page = 1,
    pageSize = 10,
    category,
    type,
    isAvailable,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
  }
) => {
  try {
    const params = new URLSearchParams({
      tags: tagIds.join(" "), // Join tag IDs with spaces
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    // Add optional parameters only if they have values
    if (category) params.append("category", category);
    if (type) params.append("type", type);
    if (isAvailable !== undefined)
      params.append("isAvailable", isAvailable.toString());
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await fetch(
      `${API_BASE_URL}/tags/meals?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle the response format for tags meals endpoint
    if (data.success && data.data && Array.isArray(data.data.meals)) {
      const totalMeals = data.data.totalMeals || data.data.meals.length;
      return {
        meals: data.data.meals,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMeals / pageSize),
          hasNextPage: page * pageSize < totalMeals,
          hasPrevPage: page > 1,
          totalItems: totalMeals,
        },
        requestedTags: data.data.requestedTags || [],
        foundTags: data.data.foundTags || [],
      };
    }

    return data.data; // Fallback to original structure
  } catch (error) {
    console.error("Error fetching meals by tags:", error);
    throw error;
  }
};

// Search meals
export const searchMeals = async (searchQuery, page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams({
      searchQuery,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/meals/search?${params.toString()}`,
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
    console.error("Error searching meals:", error);
    throw error;
  }
};

// Get meal by ID
export const getMealById = async (mealId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
      method: "GET",
      headers: buildHeaders(false), // Public endpoint
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    throw error;
  }
};

// Create new meal
export const createMeal = async (mealData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: "POST",
      headers: buildHeaders(true), // Admin required
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating meal:", error);
    throw error;
  }
};

// Update meal
export const updateMeal = async (mealId, mealData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
      method: "PUT",
      headers: buildHeaders(true), // Admin required
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating meal:", error);
    throw error;
  }
};

// Delete meal
export const deleteMeal = async (mealId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
      method: "DELETE",
      headers: buildHeaders(true), // Admin required
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw error;
  }
};

export default {
  getMeals,
  getMealsByTags,
  searchMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
