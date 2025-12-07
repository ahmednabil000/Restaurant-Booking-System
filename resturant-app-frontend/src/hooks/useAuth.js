import { useMemo } from "react";
import useAuthStore from "../store/authStore";
import {
  getStoredToken,
  getUserRoleFromToken,
  isAdmin,
  isTokenExpired,
} from "../utils/jwt";

/**
 * Custom hook for authentication and role management
 * @returns {object} - Authentication and role utilities
 */
const useAuth = () => {
  const { user, isAuthenticated, logout, token: storeToken } = useAuthStore();

  const authData = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
        isAdmin: false,
        isTokenValid: false,
      };
    }

    const token = getStoredToken() || storeToken;

    if (!token || isTokenExpired(token)) {
      // Auto-logout if token is expired
      setTimeout(() => logout(), 0);
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
        isAdmin: false,
        isTokenValid: false,
      };
    }

    const role = getUserRoleFromToken(token);
    const adminStatus = isAdmin(token);

    return {
      isAuthenticated: true,
      user,
      token,
      role,
      isAdmin: adminStatus,
      isTokenValid: true,
    };
  }, [isAuthenticated, user, storeToken, logout]);

  /**
   * Check if user has specific role
   * @param {string|Array<string>} requiredRole - Role(s) to check
   * @returns {boolean} - Whether user has the role
   */
  const hasRole = (requiredRole) => {
    if (!authData.isTokenValid || !authData.role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.some(
        (role) =>
          authData.role.toLowerCase() === role.toLowerCase() ||
          (Array.isArray(authData.role) &&
            authData.role.some((r) => role.toLowerCase() === r.toLowerCase()))
      );
    }

    if (Array.isArray(authData.role)) {
      return authData.role.some(
        (r) => r.toLowerCase() === requiredRole.toLowerCase()
      );
    }

    return authData.role.toLowerCase() === requiredRole.toLowerCase();
  };

  /**
   * Check if user can access admin features
   * @returns {boolean} - Whether user is admin
   */
  const canAccessAdmin = () => {
    return authData.isTokenValid && authData.isAdmin;
  };

  /**
   * Check if user can access specific feature
   * @param {string} feature - Feature to check access for
   * @returns {boolean} - Whether user can access the feature
   */
  const canAccess = (feature) => {
    if (!authData.isAuthenticated || !authData.isTokenValid) return false;

    switch (feature) {
      case "dashboard":
      case "admin":
        return authData.isAdmin;
      case "cart":
      case "reservation":
        return authData.isAuthenticated;
      default:
        return authData.isAuthenticated;
    }
  };

  return {
    ...authData,
    hasRole,
    canAccessAdmin,
    canAccess,
    logout,
  };
};

export default useAuth;
