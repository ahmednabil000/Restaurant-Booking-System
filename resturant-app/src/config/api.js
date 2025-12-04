// Global API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

// API endpoints helper
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
};

export default API_BASE_URL;
