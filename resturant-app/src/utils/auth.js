// Auth utility functions

/**
 * Check authentication status
 * @returns {object} - Authentication result with success status and user data
 */
export const checkAuthStatus = async () => {
  try {
    // Get user data from localStorage (Zustand persist)
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      const parsed = JSON.parse(authStorage);

      if (parsed.state && parsed.state.isAuthenticated && parsed.state.user) {
        return {
          success: true,
          user: parsed.state.user,
        };
      }
    }

    return {
      success: false,
      error: "No authenticated user found",
    };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return {
      success: false,
      error: "Failed to check authentication status",
    };
  }
};

/**
 * Validate if user session is still valid
 * @param {object} user - User object
 * @returns {boolean} - Whether the session is valid
 */
export const isSessionValid = (user) => {
  if (!user) return false;

  // Add any session validation logic here
  // For example, check if user has required fields
  return user.id && user.email;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem("auth-storage");
  sessionStorage.removeItem("authType");
};

/**
 * Get user display name
 * @param {object} user - User object
 * @returns {string} - Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return "";

  if (user.name) return user.name;
  if (user.given_name && user.family_name) {
    return `${user.given_name} ${user.family_name}`;
  }
  if (user.given_name) return user.given_name;
  if (user.email) return user.email.split("@")[0];

  return "مستخدم";
};

/**
 * Check if user has specific permissions (placeholder for future use)
 * @param {object} user - User object
 * @returns {boolean} - Whether user has permission
 */
export const hasPermission = (user) => {
  if (!user) return false;

  // Placeholder for permission checking logic
  // This can be expanded based on your needs
  return true;
};
