# User Management API Documentation

## Overview

This API provides comprehensive user and role management functionality for the restaurant application. It supports user creation, updating, deletion, role assignment, and role management.

## Authentication Requirements

- Public routes: No authentication required
- User routes: JWT authentication required (`Authorization: Bearer <token>`)
- Admin routes: JWT authentication + admin or owner role required

## User Management Endpoints

### Get User Profile

- **GET** `/api/profile`
- **Authentication:** User JWT required
- **Description:** Get current authenticated user's profile
- **Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

### Get All Users

- **GET** `/api/users`
- **Authentication:** Admin/Owner JWT required
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search by name or email
  - `role` (optional): Filter by role
- **Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### Get User by ID

- **GET** `/api/users/{id}`
- **Authentication:** Admin/Owner JWT required
- **Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Create User

- **POST** `/api/users`
- **Authentication:** Admin/Owner JWT required
- **Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "password": "optional-password"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "generated-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true
    }
  }
}
```

### Update User

- **PUT** `/api/users/{id}`
- **Authentication:** Admin/Owner JWT required
- **Request Body:**

```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "role": "staff"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "Updated Name",
      "email": "updated@example.com",
      "role": "staff"
    }
  }
}
```

### Delete User

- **DELETE** `/api/users/{id}`
- **Authentication:** Admin/Owner JWT required
- **Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Assign Role to User

- **PUT** `/api/users/{id}/role`
- **Authentication:** Admin/Owner JWT required
- **Request Body:**

```json
{
  "role": "admin"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Role \"admin\" assigned to user successfully",
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

### Get User Statistics

- **GET** `/api/users/stats`
- **Authentication:** Admin/Owner JWT required
- **Response:**

```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 100,
    "byRole": [
      { "role": "customer", "count": "75" },
      { "role": "staff", "count": "20" },
      { "role": "admin", "count": "5" }
    ],
    "roles": [
      { "role": "customer", "count": 75, "percentage": "75.0" },
      { "role": "staff", "count": 20, "percentage": "20.0" },
      { "role": "admin", "count": 5, "percentage": "5.0" }
    ]
  }
}
```

## Role Management Endpoints

### Get All Roles

- **GET** `/api/roles`
- **Authentication:** Admin/Owner JWT required
- **Query Parameters:**
  - `includeInactive` (optional): Include inactive roles (default: false)
- **Response:**

```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "roles": [
      {
        "id": "role-id",
        "name": "customer",
        "displayName": "Customer",
        "description": "Default customer role with basic access",
        "isActive": true,
        "isSystemRole": true
      }
    ]
  }
}
```

### Get Role by ID

- **GET** `/api/roles/{id}`
- **Authentication:** Admin/Owner JWT required
- **Response:**

```json
{
  "success": true,
  "message": "Role retrieved successfully",
  "data": {
    "role": {
      "id": "role-id",
      "name": "manager",
      "displayName": "Manager",
      "description": "Restaurant manager role",
      "isActive": true,
      "isSystemRole": false
    }
  }
}
```

### Create Role

- **POST** `/api/roles`
- **Authentication:** Admin/Owner JWT required
- **Request Body:**

```json
{
  "name": "Manager",
  "displayName": "Restaurant Manager",
  "description": "Manager role with extended access"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role": {
      "id": "generated-id",
      "name": "manager",
      "displayName": "Restaurant Manager",
      "description": "Manager role with extended access",
      "isActive": true,
      "isSystemRole": false
    }
  }
}
```

### Update Role

- **PUT** `/api/roles/{id}`
- **Authentication:** Admin/Owner JWT required
- **Request Body:**

```json
{
  "displayName": "Updated Manager",
  "description": "Updated description",
  "isActive": true
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "role": {
      "id": "role-id",
      "name": "manager",
      "displayName": "Updated Manager",
      "description": "Updated description",
      "isActive": true
    }
  }
}
```

### Delete Role

- **DELETE** `/api/roles/{id}`
- **Authentication:** Admin/Owner JWT required
- **Response:**

```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

## Available Roles

### System Roles (Cannot be deleted)

1. **Customer** - Default role for new users
   - Basic access for making reservations and managing cart
2. **Staff** - Restaurant staff members
   - Access to view and manage reservations
3. **Admin** - System administrators
   - Full access to all system features
4. **Owner** - Restaurant owners
   - Full access to all system features

### Custom Roles

- Can be created, updated, and deleted by admins/owners
- Cannot be system roles
- Can have custom descriptions and access levels

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Admin or owner access required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User/Role not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Usage Examples

### Create a new staff member

```bash
POST /api/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "fullName": "Ahmed Hassan",
  "email": "ahmed@restaurant.com",
  "role": "staff",
  "password": "secure123"
}
```

### Assign admin role to user

```bash
PUT /api/users/user-id-123/role
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "role": "admin"
}
```

### Create custom manager role

```bash
POST /api/roles
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Branch Manager",
  "displayName": "Branch Manager",
  "description": "Manages a specific restaurant branch"
}
```

This API provides complete user and role management functionality with proper authentication and authorization controls.
