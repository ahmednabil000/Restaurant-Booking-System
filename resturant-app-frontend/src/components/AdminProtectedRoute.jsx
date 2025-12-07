import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { getStoredToken, isAdmin, isTokenExpired } from "../utils/jwt";

/**
 * AdminProtectedRoute component to protect routes that require admin role
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if user is admin
 * @param {string} props.redirectTo - Path to redirect to if not admin
 * @param {string} props.fallbackRedirect - Path to redirect to if not authenticated
 * @param {boolean} props.showUnauthorized - Whether to show unauthorized page instead of redirecting
 * @returns {React.ReactNode} - Protected component or redirect
 */
const AdminProtectedRoute = ({
  children,
  redirectTo = "/unauthorized",
  fallbackRedirect = "/login",
  showUnauthorized = false,
}) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackRedirect} replace />;
  }

  // Get and validate JWT token
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) {
    // If token is expired, logout user
    logout();
    return <Navigate to={fallbackRedirect} replace />;
  }

  // Check if user has admin role
  if (!isAdmin(token)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
