import {
  getStoredToken,
  isTokenExpired,
  getUserRoleFromToken,
  isAdmin,
} from "./jwt";

// Auth utility functions

/**
 * Check authentication status with JWT validation
 * @returns {object} - Authentication result with success status and user data
 */
export const checkAuthStatus = async () => {
  try {
    // Get user data from localStorage (Zustand persist)
    const authStorage = localStorage.getItem("auth-storage");
    const token = getStoredToken();

    if (authStorage && token && !isTokenExpired(token)) {
      const parsed = JSON.parse(authStorage);

      if (parsed.state && parsed.state.isAuthenticated && parsed.state.user) {
        return {
          success: true,
          user: parsed.state.user,
          token: token,
          role: getUserRoleFromToken(token),
          isAdmin: isAdmin(token),
        };
      }
    }

    return {
      success: false,
      error: "No authenticated user found or token expired",
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
 * Validate if user session is still valid with JWT check
 * @param {object} user - User object
 * @returns {boolean} - Whether the session is valid
 */
export const isSessionValid = (user) => {
  if (!user) return false;

  // Check if user has required fields
  const hasRequiredFields = user.id && user.email;
  if (!hasRequiredFields) return false;

  // Check JWT token validity
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) return false;

  return true;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("token");
  localStorage.removeItem("jwt_token");
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
 * Check if user has specific permissions with role-based checking
 * @param {object} user - User object
 * @param {string|Array<string>} requiredRole - Required role(s)
 * @returns {boolean} - Whether user has permission
 */
export const hasPermission = (user, requiredRole = null) => {
  if (!user) return false;

  // If no specific role required, just check if authenticated
  if (!requiredRole) return true;

  const token = getStoredToken();
  if (!token || isTokenExpired(token)) return false;

  const userRole = getUserRoleFromToken(token);
  if (!userRole) return false;

  // Handle admin check
  if (requiredRole === "admin") {
    return isAdmin(token);
  }

  // Handle array of roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(
      (role) =>
        userRole.toLowerCase() === role.toLowerCase() ||
        (Array.isArray(userRole) &&
          userRole.some((r) => role.toLowerCase() === r.toLowerCase()))
    );
  }

  // Handle single role
  if (Array.isArray(userRole)) {
    return userRole.some((r) => r.toLowerCase() === requiredRole.toLowerCase());
  }

  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Check if current user is admin
 * @returns {boolean} - Whether current user is admin
 */
export const isCurrentUserAdmin = () => {
  const token = getStoredToken();
  return token ? isAdmin(token) : false;
};
