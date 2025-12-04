import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { getStoredToken, isTokenExpired } from "../utils/jwt";

/**
 * ProtectedRoute component to protect routes that require authentication
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect to if not authenticated
 * @returns {React.ReactNode} - Protected component or redirect
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  // Check if user is authenticated in store
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Additional check for JWT token validity
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) {
    // If token is expired, logout user
    logout();
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
