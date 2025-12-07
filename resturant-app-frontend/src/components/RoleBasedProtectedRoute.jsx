import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  getStoredToken,
  isAdmin,
  getUserRoleFromToken,
  isTokenExpired,
} from "../utils/jwt";

/**
 * RoleBasedProtectedRoute component for flexible role-based protection
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>|string} props.allowedRoles - Allowed roles (optional)
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {boolean} props.adminOnly - Whether admin role is required (default: false)
 * @param {string} props.redirectTo - Path to redirect to if not authorized
 * @param {string} props.loginRedirect - Path to redirect to if not authenticated
 * @returns {React.ReactNode} - Protected component or redirect
 */
const RoleBasedProtectedRoute = ({
  children,
  allowedRoles = null,
  requireAuth = true,
  adminOnly = false,
  redirectTo = "/",
  loginRedirect = "/login",
}) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  // Check authentication if required
  if (requireAuth) {
    if (!isAuthenticated || !user) {
      return <Navigate to={loginRedirect} replace />;
    }

    // Get and validate JWT token
    const token = getStoredToken();
    if (!token || isTokenExpired(token)) {
      logout();
      return <Navigate to={loginRedirect} replace />;
    }

    // Check admin role if required
    if (adminOnly && !isAdmin(token)) {
      return <Navigate to={redirectTo} replace />;
    }

    // Check specific roles if provided
    if (allowedRoles) {
      const userRole = getUserRoleFromToken(token);
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (
        !userRole ||
        !roles.some(
          (role) =>
            userRole.toLowerCase() === role.toLowerCase() ||
            (Array.isArray(userRole) &&
              userRole.some((r) =>
                roles.some(
                  (allowedRole) => r.toLowerCase() === allowedRole.toLowerCase()
                )
              ))
        )
      ) {
        return <Navigate to={redirectTo} replace />;
      }
    }
  }

  return children;
};

export default RoleBasedProtectedRoute;
