// Tags API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Get all available tags
export const getTags = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};
