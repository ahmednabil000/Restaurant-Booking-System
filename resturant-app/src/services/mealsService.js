// Meals API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
      headers: {
        "Content-Type": "application/json",
      },
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
