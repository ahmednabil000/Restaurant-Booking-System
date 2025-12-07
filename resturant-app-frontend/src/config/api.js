// Global API configuration
export const API_BASE_URL ="https://restaurant-booking-system-p6kp.onrender.com";

// API endpoints helper
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
};

export default API_BASE_URL;
