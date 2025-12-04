/**
 * JWT utility functions
 */

/**
 * Decode JWT token without verification (for client-side role checking)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get user role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const getUserRoleFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return null;

    // Check various possible role fields in JWT
    return (
      decoded.role ||
      decoded.roles ||
      decoded.user_role ||
      decoded.authority ||
      null
    );
  } catch (error) {
    console.error("Error getting user role from token:", error);
    return null;
  }
};

/**
 * Check if user has admin role from JWT token
 * @param {string} token - JWT token
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (token) => {
  try {
    const role = getUserRoleFromToken(token);
    if (!role) return false;

    // Handle both string and array roles
    if (Array.isArray(role)) {
      return role.some(
        (r) =>
          r.toLowerCase() === "admin" ||
          r.toLowerCase() === "administrator" ||
          r.toLowerCase() === "super_admin" ||
          r.toLowerCase() === "owner"
      );
    }

    const roleStr = role.toLowerCase();
    return (
      roleStr === "admin" ||
      roleStr === "administrator" ||
      roleStr === "super_admin" ||
      roleStr === "owner"
    );
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
};

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null
 */
export const getStoredToken = () => {
  try {
    // Try to get token from different possible storage keys
    const token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt_token");

    if (token && !isTokenExpired(token)) {
      return token;
    }

    // If token is expired, remove it
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("jwt_token");
    }

    return null;
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};
