# Restaurant Update API Documentation

This document outlines the available endpoints for updating restaurant data in the Restaurant Booking System.

## Table of Contents

- [Authentication](#authentication)
- [Endpoints Overview](#endpoints-overview)
- [Detailed Endpoint Documentation](#detailed-endpoint-documentation)
- [Error Responses](#error-responses)
- [Examples](#examples)

## Authentication

All restaurant update endpoints require:

- **JWT Authentication**: Include a valid JWT token in the Authorization header
- **Admin/Owner Role**: Only users with admin or owner roles can access these endpoints

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Overview

| Method | Endpoint                           | Description                                        |
| ------ | ---------------------------------- | -------------------------------------------------- |
| PUT    | `/restaurant`                      | Update all restaurant information                  |
| PATCH  | `/restaurant/basic-info`           | Update basic information (name, description, etc.) |
| PATCH  | `/restaurant/contact-info`         | Update contact information (address, phone, email) |
| PATCH  | `/restaurant/reservation-settings` | Update reservation-related settings                |
| PATCH  | `/restaurant/operating-hours`      | Update operating hours                             |
| PUT    | `/restaurant/tables`               | Update tables count                                |

## Detailed Endpoint Documentation

### 1. Update Basic Information

**PATCH** `/restaurant/basic-info`

Updates basic restaurant information such as name, description, cuisine type, image, and price range.

#### Request Body

```json
{
  "name": "Restaurant Name",
  "description": "Restaurant description",
  "cuisine": "Italian",
  "imageUrl": "https://example.com/image.jpg",
  "priceRange": "$$"
}
```

#### Field Validations

- `name`: 2-100 characters
- `cuisine`: 2-50 characters
- `priceRange`: Must be one of: "$", "$$", "$$$", "$$$$"
- `imageUrl`: Must be a valid URL format

#### Response

```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Updated Restaurant Name",
    "description": "Updated description",
    "cuisine": "Italian",
    "imageUrl": "https://example.com/image.jpg",
    "priceRange": "$$"
  },
  "message": "Basic information updated successfully"
}
```

### 2. Update Contact Information

**PATCH** `/restaurant/contact-info`

Updates restaurant contact details including address, phone number, and email.

#### Request Body

```json
{
  "address": "123 Main Street, City, Country",
  "phone": "+1234567890",
  "email": "restaurant@example.com"
}
```

#### Field Validations

- `phone`: 10-20 characters
- `email`: Must be a valid email format
- `address`: Cannot be empty if provided

#### Response

```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "address": "123 Main Street, City, Country",
    "phone": "+1234567890",
    "email": "restaurant@example.com"
  },
  "message": "Contact information updated successfully"
}
```

### 3. Update Reservation Settings

**PATCH** `/restaurant/reservation-settings`

Updates reservation-related configuration settings.

#### Request Body

```json
{
  "totalCapacity": 100,
  "avgTableCapacity": 4,
  "reservationSlotDuration": 120,
  "maxReservationsPerDay": 50,
  "maxGuestsPerReservation": 10,
  "advanceBookingDays": 30,
  "allowReservations": true,
  "serviceFees": 5.0
}
```

#### Field Validations

- `totalCapacity`: 1-1000
- `avgTableCapacity`: 1-20
- `reservationSlotDuration`: 30-300 minutes
- `maxReservationsPerDay`: 1-1000
- `maxGuestsPerReservation`: 1-50
- `advanceBookingDays`: 1-365 days
- `allowReservations`: Boolean
- `serviceFees`: Decimal value

#### Response

```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "totalCapacity": 100,
    "avgTableCapacity": 4,
    "reservationSlotDuration": 120,
    "maxReservationsPerDay": 50,
    "maxGuestsPerReservation": 10,
    "advanceBookingDays": 30,
    "allowReservations": true,
    "serviceFees": "5.00"
  },
  "message": "Reservation settings updated successfully"
}
```

### 4. Update Operating Hours

**PATCH** `/restaurant/operating-hours`

Updates restaurant opening and closing times.

#### Request Body

```json
{
  "openingTime": "09:00",
  "closingTime": "22:00"
}
```

#### Field Validations

- Time format: HH:MM or HH:MM:SS
- Valid time range: 00:00 - 23:59

#### Response

```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "openingTime": "09:00:00",
    "closingTime": "22:00:00"
  },
  "message": "Operating hours updated successfully"
}
```

### 5. Update Tables Count

**PUT** `/restaurant/tables`

Updates the number of tables in the restaurant.

#### Request Body

```json
{
  "tablesCount": 20
}
```

#### Field Validations

- `tablesCount`: 1-1000

#### Response

```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Restaurant Name",
    "tablesCount": 20
  },
  "message": "Tables count updated successfully"
}
```

### 6. Full Restaurant Update

**PUT** `/restaurant`

Updates all restaurant information in a single request. Accepts any combination of the fields from the above endpoints.

#### Request Body

```json
{
  "name": "New Restaurant Name",
  "address": "Updated Address",
  "phone": "+1987654321",
  "tablesCount": 25,
  "openingTime": "10:00",
  "serviceFees": 7.5
}
```

## Error Responses

All endpoints return consistent error responses:

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
  "message": "Access denied. Valid JWT token required."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Admin or owner role required."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Examples

### Example 1: Update Restaurant Name and Cuisine

```bash
curl -X PATCH http://localhost:8080/restaurant/basic-info \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bella Vista Italian Restaurant",
    "cuisine": "Italian"
  }'
```

### Example 2: Update Contact Information

```bash
curl -X PATCH http://localhost:8080/restaurant/contact-info \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "456 Oak Avenue, Downtown",
    "phone": "+1555123456",
    "email": "contact@bellavista.com"
  }'
```

### Example 3: Update Reservation Settings

```bash
curl -X PATCH http://localhost:8080/restaurant/reservation-settings \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "maxGuestsPerReservation": 8,
    "reservationSlotDuration": 90,
    "allowReservations": true
  }'
```

### Example 4: Update Operating Hours

```bash
curl -X PATCH http://localhost:8080/restaurant/operating-hours \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "openingTime": "08:30",
    "closingTime": "23:00"
  }'
```

## Notes

- All PATCH endpoints support partial updates - you only need to include the fields you want to update
- The PUT endpoints (full update and tables update) maintain backward compatibility
- All endpoints validate input data according to the restaurant model constraints
- Updates are atomic - if validation fails for any field, no changes are made
- The restaurant is identified automatically by finding the active restaurant record
- All endpoints return the updated restaurant data in the response

## Related Documentation

- [Restaurant Management API](./API_Documentation.md)
- [Authentication API](./User_Management_API.md)
- [Reservation Management API](./Reservation_Management_API.md)
