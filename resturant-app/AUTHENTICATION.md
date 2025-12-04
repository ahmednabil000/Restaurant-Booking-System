# Authentication and Authorization System

This document explains how to use the authentication and authorization system in the restaurant app.

## Overview

The system provides three levels of protection:

1. **Authentication Check** - Verifies if user is logged in
2. **Admin Role Check** - Verifies if user has admin role from JWT token
3. **Flexible Role-based Protection** - Custom role checking

## Components

### 1. ProtectedRoute

Protects routes that require authentication only.

```jsx
import ProtectedRoute from "./components/ProtectedRoute";

// Usage
<ProtectedRoute redirectTo="/login">
  <YourComponent />
</ProtectedRoute>;
```

### 2. AdminProtectedRoute

Protects routes that require admin role.

```jsx
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Usage
<AdminProtectedRoute redirectTo="/unauthorized" fallbackRedirect="/login">
  <AdminComponent />
</AdminProtectedRoute>;
```

### 3. RoleBasedProtectedRoute

Flexible role-based protection.

```jsx
import RoleBasedProtectedRoute from './components/RoleBasedProtectedRoute';

// Admin only
<RoleBasedProtectedRoute adminOnly={true}>
  <AdminComponent />
</RoleBasedProtectedRoute>

// Specific roles
<RoleBasedProtectedRoute allowedRoles={['manager', 'admin']}>
  <ManagerComponent />
</RoleBasedProtectedRoute>

// Just authentication
<RoleBasedProtectedRoute requireAuth={true}>
  <AuthenticatedComponent />
</RoleBasedProtectedRoute>
```

## Hooks

### useAuth Hook

Provides authentication state and utilities.

```jsx
import useAuth from "./hooks/useAuth";

function MyComponent() {
  const {
    isAuthenticated,
    user,
    isAdmin,
    role,
    hasRole,
    canAccessAdmin,
    canAccess,
    logout,
  } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      {canAccessAdmin() && <AdminButton />}
      {hasRole("manager") && <ManagerButton />}
      {canAccess("cart") && <CartButton />}
    </div>
  );
}
```

## JWT Token Structure

The system expects JWT tokens to contain role information in one of these fields:

- `role`
- `roles`
- `user_role`
- `authority`

Admin roles are identified by:

- `admin`
- `administrator`
- `super_admin`

## Implementation in Routes

### Current Implementation

```jsx
// Authentication required routes
{
  path: "cart",
  element: (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  )
},
{
  path: "reserve",
  element: (
    <ProtectedRoute>
      <TableBooking />
    </ProtectedRoute>
  )
},

// Admin required routes
{
  path: "dashboard/overview",
  element: (
    <AdminProtectedRoute>
      <Overview />
    </AdminProtectedRoute>
  ),
},
```

## Token Management

### Storing JWT Token

When user logs in, store the JWT token:

```jsx
import useAuthStore from "./store/authStore";

const { login } = useAuthStore();

// Login with token
login(userData, jwtToken);
```

### Automatic Token Validation

The system automatically:

- Checks token expiration
- Validates token format
- Extracts user roles
- Logs out users with expired tokens

## Error Handling

### Unauthorized Access

Users without proper permissions are redirected to `/unauthorized` page.

### Expired Tokens

Users with expired tokens are automatically logged out and redirected to login.

### Missing Authentication

Unauthenticated users trying to access protected routes are redirected to `/login`.

## Utility Functions

### JWT Utilities (`utils/jwt.js`)

- `decodeJWT(token)` - Decode JWT payload
- `isTokenExpired(token)` - Check if token is expired
- `getUserRoleFromToken(token)` - Extract user role
- `isAdmin(token)` - Check if user is admin
- `getStoredToken()` - Get token from localStorage

### Auth Utilities (`utils/auth.js`)

- `checkAuthStatus()` - Check authentication with JWT validation
- `isSessionValid(user)` - Validate user session
- `hasPermission(user, role)` - Check user permissions
- `isCurrentUserAdmin()` - Check if current user is admin
- `clearAuthData()` - Clear all auth data

## Best Practices

1. **Always use JWT tokens** for role verification
2. **Wrap sensitive routes** with appropriate protection components
3. **Use useAuth hook** for conditional rendering
4. **Handle token expiration** gracefully
5. **Provide clear error messages** for unauthorized access

## Security Notes

- JWT tokens are decoded client-side for role checking
- Server-side validation is still required for API calls
- Tokens should have reasonable expiration times
- Always validate permissions on the backend
