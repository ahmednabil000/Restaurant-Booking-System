# 📅 Reservation Management API Documentation

This document provides comprehensive API documentation for the Restaurant Reservation Management system, including endpoints for managing reservations, settings, and notifications.

## 📋 **إدارة الحجوزات (Reservations Management) - API Documentation**

### 🔹 **1. Get All Reservations (Admin)**

- **Method:** `GET`
- **Endpoint:** `/reservations`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`

**Query Parameters (all optional):**

- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)
- `date` (string): Filter by specific date (YYYY-MM-DD)
- `status` (string): Filter by status (pending, confirmed, rejected, cancelled, completed, no-show)
- `peopleNum` (number): Filter by party size
- `startDate` (string): Filter from date (YYYY-MM-DD)
- `endDate` (string): Filter to date (YYYY-MM-DD)
- `sortBy` (string): Sort field (date, startTime, peopleNum, status)
- `sortOrder` (string): Sort order (ASC/DESC)

**Example:** `/reservations?date=2025-12-01&status=pending&sortBy=startTime&sortOrder=ASC`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "reservation-uuid",
        "fullName": "أحمد محمد",
        "phone": "+966501234567",
        "email": "ahmed@example.com",
        "date": "2025-12-01",
        "startTime": "19:00:00",
        "endTime": "21:00:00",
        "partySize": 4,
        "status": "pending",
        "specialRequests": "طاولة بجانب النافذة",
        "tableNumber": "T12",
        "createdAt": "2025-12-01T10:00:00.000Z",
        "user": {
          "id": "user-uuid",
          "fullName": "أحمد محمد",
          "email": "ahmed@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Reservations retrieved successfully"
}
```

### 🔹 **2. Get Reservation by ID**

- **Method:** `GET`
- **Endpoint:** `/reservations/:id`
- **Authentication:** None (Public)

**URL Parameters:**

- `id` (string): Reservation UUID (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "fullName": "أحمد محمد",
    "phone": "+966501234567",
    "email": "ahmed@example.com",
    "date": "2025-12-01",
    "startTime": "19:00:00",
    "endTime": "21:00:00",
    "partySize": 4,
    "status": "confirmed",
    "specialRequests": "طاولة بجانب النافذة",
    "tableNumber": "T12",
    "confirmationToken": "confirm-token-123",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T11:00:00.000Z"
  }
}
```

### 🔹 **3. Create New Reservation**

- **Method:** `POST`
- **Endpoint:** `/reservations`
- **Authentication:** JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

**Request Body:**

```json
{
  "fullName": "سارة أحمد",
  "phone": "+966501234567",
  "peopleNum": 6,
  "date": "2025-12-05",
  "startTime": "20:00",
  "endTime": "22:00",
  "notes": "احتفال بعيد ميلاد",
  "tableNumber": "T15"
}
```

**Required Fields:**

- `fullName` (string): Customer name
- `phone` (string): Phone number
- `peopleNum` (number): Party size (1-20)
- `date` (string): Reservation date (YYYY-MM-DD)
- `startTime` (string): Start time (HH:MM)

**Optional Fields:**

- `endTime` (string): End time (HH:MM)
- `notes` (string): Special requests
- `tableNumber` (string): Preferred table

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "id": "new-reservation-uuid",
    "fullName": "سارة أحمد",
    "phone": "+966501234567",
    "peopleNum": 6,
    "date": "2025-12-05",
    "startTime": "20:00:00",
    "endTime": "22:00:00",
    "status": "pending",
    "specialRequests": "احتفال بعيد ميلاد",
    "confirmationToken": "generated-token",
    "createdAt": "2025-12-01T12:00:00.000Z"
  },
  "message": "Reservation created successfully"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Party size must be between 1 and 20 people"
}
```

### 🔹 **4. Confirm Reservation (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/:id/confirm`
- **Authentication:** Admin JWT required

**URL Parameters:**

- `id` (string): Reservation UUID (required)

**Request Body (optional):**

```json
{
  "tableNumber": "T12",
  "notes": "تم تجهيز الطاولة المطلوبة"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "confirmed",
    "tableNumber": "T12",
    "updatedAt": "2025-12-01T13:00:00.000Z"
  },
  "message": "Reservation confirmed successfully"
}
```

### 🔹 **5. Reject Reservation (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/:id/reject`
- **Authentication:** Admin JWT required

**Request Body:**

```json
{
  "reason": "المطعم مكتمل الحجز في هذا التوقيت"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "rejected",
    "rejectionReason": "المطعم مكتمل الحجز في هذا التوقيت",
    "updatedAt": "2025-12-01T13:00:00.000Z"
  },
  "message": "Reservation rejected successfully"
}
```

### 🔹 **6. Update Reservation (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/:id`
- **Authentication:** Admin JWT required

**Request Body (all fields optional):**

```json
{
  "fullName": "سارة أحمد محدث",
  "phone": "+966509876543",
  "peopleNum": 8,
  "date": "2025-12-06",
  "startTime": "19:30",
  "endTime": "21:30",
  "tableNumber": "T20",
  "specialRequests": "طاولة هادئة للاحتفال",
  "status": "confirmed"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "fullName": "سارة أحمد محدث",
    "peopleNum": 8,
    "date": "2025-12-06",
    "status": "confirmed",
    "updatedAt": "2025-12-01T14:00:00.000Z"
  },
  "message": "Reservation updated successfully"
}
```

### 🔹 **7. Complete Reservation (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/:id/complete`
- **Authentication:** Admin JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "completed",
    "updatedAt": "2025-12-01T22:00:00.000Z"
  },
  "message": "Reservation marked as completed successfully"
}
```

### 🔹 **8. Mark No-Show (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/:id/no-show`
- **Authentication:** Admin JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "no-show",
    "updatedAt": "2025-12-01T20:30:00.000Z"
  },
  "message": "Reservation marked as no-show successfully"
}
```

### 🔹 **9. Bulk Update Reservation Status (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservations/bulk/status`
- **Authentication:** Admin JWT required

**Request Body:**

```json
{
  "reservationIds": [
    "reservation-uuid-1",
    "reservation-uuid-2",
    "reservation-uuid-3"
  ],
  "status": "confirmed",
  "reason": "تأكيد جماعي للحجوزات"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "3 reservations updated to confirmed",
  "data": {
    "updatedCount": 3,
    "status": "confirmed"
  }
}
```

### 🔹 **10. Send Confirmation Notification (Admin)**

- **Method:** `POST`
- **Endpoint:** `/reservations/:id/send-confirmation`
- **Authentication:** Admin JWT required

**Request Body:**

```json
{
  "method": "email"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Confirmation notification sent via email"
}
```

### 🔹 **11. Send Rejection Notification (Admin)**

- **Method:** `POST`
- **Endpoint:** `/reservations/:id/send-rejection`
- **Authentication:** Admin JWT required

**Request Body:**

```json
{
  "method": "email",
  "reason": "عذراً، المطعم مكتمل الحجز في هذا التوقيت"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Rejection notification sent via email"
}
```

---

## ⚙️ **إعدادات الحجز (Reservation Settings)**

### 🔹 **12. Get Reservation Settings (Admin)**

- **Method:** `GET`
- **Endpoint:** `/reservation-settings`
- **Authentication:** Admin JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "restaurant-uuid",
    "totalCapacity": 100,
    "avgTableCapacity": 4,
    "openingTime": "09:00:00",
    "closingTime": "23:00:00",
    "reservationSlotDuration": 120,
    "maxReservationsPerDay": 50,
    "maxGuestsPerReservation": 20,
    "advanceBookingDays": 30,
    "allowReservations": true
  },
  "message": "Reservation settings retrieved successfully"
}
```

### 🔹 **13. Update Reservation Settings (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/reservation-settings`
- **Authentication:** Admin JWT required

**Request Body (all fields optional):**

```json
{
  "totalCapacity": 120,
  "avgTableCapacity": 6,
  "openingTime": "08:00:00",
  "closingTime": "24:00:00",
  "reservationSlotDuration": 90,
  "maxReservationsPerDay": 60,
  "maxGuestsPerReservation": 25,
  "advanceBookingDays": 45,
  "allowReservations": true
}
```

**Field Descriptions:**

- `totalCapacity`: Maximum number of guests at one time
- `avgTableCapacity`: Average guests per table
- `openingTime`: Restaurant opening time (HH:MM:SS)
- `closingTime`: Restaurant closing time (HH:MM:SS)
- `reservationSlotDuration`: Duration per reservation in minutes
- `maxReservationsPerDay`: Maximum reservations per day
- `maxGuestsPerReservation`: Maximum guests per single reservation
- `advanceBookingDays`: How many days in advance can customers book
- `allowReservations`: Enable/disable reservations

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "totalCapacity": 120,
    "avgTableCapacity": 6,
    "openingTime": "08:00:00",
    "closingTime": "24:00:00",
    "reservationSlotDuration": 90,
    "updatedAt": "2025-12-01T15:00:00.000Z"
  },
  "message": "Reservation settings updated successfully"
}
```

### 🔹 **14. Get Available Time Slots**

- **Method:** `GET`
- **Endpoint:** `/available-time-slots`
- **Authentication:** None (Public)

**Query Parameters:**

- `date` (string, required): Date to check (YYYY-MM-DD)
- `peopleNum` (number, optional): Number of people (default: 2)

**Example:** `/available-time-slots?date=2025-12-05&peopleNum=4`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "date": "2025-12-05",
    "requestedPeople": 4,
    "totalCapacity": 100,
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "11:00",
        "availableCapacity": 100,
        "isAvailable": true
      },
      {
        "startTime": "11:00",
        "endTime": "13:00",
        "availableCapacity": 80,
        "isAvailable": true
      },
      {
        "startTime": "19:00",
        "endTime": "21:00",
        "availableCapacity": 20,
        "isAvailable": true
      },
      {
        "startTime": "21:00",
        "endTime": "23:00",
        "availableCapacity": 2,
        "isAvailable": false
      }
    ]
  },
  "message": "Available time slots retrieved successfully"
}
```

### 🔹 **15. Manage Blocked Dates (Admin)**

- **Method:** `PUT`
- **Endpoint:** `/blocked-dates`
- **Authentication:** Admin JWT required

**Request Body:**

```json
{
  "action": "block",
  "dates": ["2025-12-25", "2025-12-26", "2025-01-01"],
  "reason": "Holiday closure - Christmas and New Year"
}
```

**Actions:**

- `"block"`: Block the specified dates
- `"unblock"`: Unblock the specified dates

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Dates blocked successfully",
  "data": {
    "action": "block",
    "dates": ["2025-12-25", "2025-12-26", "2025-01-01"],
    "reason": "Holiday closure - Christmas and New Year"
  }
}
```

### 🔹 **16. Get Blocked Dates**

- **Method:** `GET`
- **Endpoint:** `/blocked-dates`
- **Authentication:** None (Public)

**Query Parameters (optional):**

- `startDate` (string): Filter from date (YYYY-MM-DD)
- `endDate` (string): Filter to date (YYYY-MM-DD)

**Example:** `/blocked-dates?startDate=2025-12-01&endDate=2025-12-31`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "blockedDates": [
      {
        "date": "2025-12-25",
        "reason": "Christmas Holiday"
      },
      {
        "date": "2025-01-01",
        "reason": "New Year Holiday"
      }
    ],
    "total": 2
  },
  "message": "Blocked dates retrieved successfully"
}
```

---

## 📊 **Analytics Endpoints**

### 🔹 **17. Get Reservation Statistics (Admin)**

- **Method:** `GET`
- **Endpoint:** `/analytics/reservation-stats`
- **Authentication:** Admin JWT required

**Query Parameters (optional):**

- `startDate` (string): Start date for statistics
- `endDate` (string): End date for statistics
- `period` (string): Time period (today, week, month, year)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "period": "Last 30 days",
    "totalReservations": 150,
    "confirmedReservations": 120,
    "pendingReservations": 15,
    "cancelledReservations": 10,
    "completedReservations": 100,
    "noShowReservations": 5,
    "rejectedReservations": 0,
    "averagePartySize": 3.2,
    "totalGuests": 480,
    "occupancyRate": 75.5,
    "peakHours": [
      {
        "hour": "19:00",
        "reservationCount": 25
      },
      {
        "hour": "20:00",
        "reservationCount": 30
      }
    ],
    "dailyStats": [
      {
        "date": "2025-12-01",
        "totalReservations": 8,
        "confirmedReservations": 6,
        "totalGuests": 24
      }
    ]
  },
  "message": "Reservation statistics retrieved successfully"
}
```

### 🔹 **18. Get Most Demanded Meals (Admin)**

- **Method:** `GET`
- **Endpoint:** `/analytics/most-demanded-meals`
- **Authentication:** Admin JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "mealId": "meal-uuid-1",
      "mealTitle": "كباب الدجاج",
      "orderCount": 45,
      "totalRevenue": "2250.00"
    },
    {
      "mealId": "meal-uuid-2",
      "mealTitle": "شاورما اللحم",
      "orderCount": 38,
      "totalRevenue": "1900.00"
    }
  ],
  "message": "Most demanded meals retrieved successfully"
}
```

### 🔹 **19. Get Recent Customer Activity (Admin)**

- **Method:** `GET`
- **Endpoint:** `/analytics/recent-customers`
- **Authentication:** Admin JWT required

**Query Parameters (optional):**

- `days` (number): Number of recent days (default: 30)
- `limit` (number): Maximum customers to return (default: 50)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "period": "Last 30 days",
    "totalCustomers": 85,
    "customers": [
      {
        "userId": "user-uuid-1",
        "fullName": "أحمد محمد",
        "email": "ahmed@example.com",
        "totalReservations": 3,
        "completedReservations": 2,
        "cancelledReservations": 1,
        "totalSpent": "450.00",
        "lastReservation": "2025-11-28",
        "avgPartySize": 4
      }
    ]
  },
  "message": "Recent customer activity retrieved successfully"
}
```

---

## 👤 **Customer Endpoints**

### 🔹 **20. Get My Reservations**

- **Method:** `GET`
- **Endpoint:** `/my-reservations`
- **Authentication:** JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "reservation-uuid",
      "fullName": "سارة أحمد",
      "date": "2025-12-05",
      "startTime": "20:00:00",
      "endTime": "22:00:00",
      "peopleNum": 6,
      "status": "confirmed",
      "tableNumber": "T15",
      "specialRequests": "احتفال بعيد ميلاد"
    }
  ],
  "message": "User reservations retrieved successfully"
}
```

### 🔹 **21. Cancel My Reservation**

- **Method:** `PUT`
- **Endpoint:** `/my-reservations/:id/cancel`
- **Authentication:** JWT required

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "cancelled",
    "updatedAt": "2025-12-01T16:00:00.000Z"
  },
  "message": "Reservation cancelled successfully"
}
```

### 🔹 **22. Confirm Reservation by Token**

- **Method:** `GET`
- **Endpoint:** `/reservations/confirm/:id`
- **Authentication:** None (Token-based)

**URL Parameters:**

- `id` (string): Confirmation token (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "confirmed",
    "message": "شكراً لتأكيد حجزك. نتطلع لاستقبالكم."
  },
  "message": "Reservation confirmed successfully"
}
```

### 🔹 **23. Cancel Reservation by Token**

- **Method:** `GET`
- **Endpoint:** `/reservations/cancel/:id`
- **Authentication:** None (Token-based)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "reservation-uuid",
    "status": "cancelled",
    "message": "تم إلغاء حجزك بنجاح. نأمل أن نراكم قريباً."
  },
  "message": "Reservation cancelled successfully"
}
```

---

## 🔐 **Authentication & Authorization**

### **JWT Token Requirements**

Most admin endpoints require JWT authentication:

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### **Role-based Access:**

- **Public:** View available tables, confirm/cancel by token
- **Authenticated Users:** Create reservations, view their reservations
- **Admin:** Full reservation management, settings, analytics

### **Error Responses:**

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Access token required"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Reservation not found"
}
```

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Party size must be between 1 and 20 people"
}
```

---

## 📧 **Notification System**

The system supports email notifications for:

- **Reservation confirmation** (sent to customers)
- **Reservation rejection** (sent to customers with reason)
- **Pending reservation alerts** (sent to admins)

### **Email Templates:**

- Confirmation emails include reservation details and cancellation links
- Rejection emails include reason and alternative suggestions
- All emails support Arabic text and RTL layout

### **WhatsApp Integration (Future):**

The system is designed to support WhatsApp notifications by extending the notification methods.

---

## 📊 **Data Models**

### **Reservation Model:**

```javascript
{
  id: "UUID string",
  fullName: "Customer name",
  email: "Customer email",
  phone: "Customer phone",
  date: "Reservation date (YYYY-MM-DD)",
  startTime: "Start time (HH:MM:SS)",
  endTime: "End time (HH:MM:SS)",
  partySize: "Number of guests",
  status: "pending|confirmed|rejected|cancelled|completed|no-show",
  specialRequests: "Special requests text",
  rejectionReason: "Reason for rejection",
  tableNumber: "Assigned table",
  confirmationToken: "Token for email confirmation",
  userId: "Associated user ID",
  cartId: "Associated cart ID",
  createdAt: "Creation timestamp",
  updatedAt: "Last update timestamp"
}
```

### **Restaurant Settings Model:**

```javascript
{
  totalCapacity: "Maximum simultaneous guests",
  avgTableCapacity: "Average guests per table",
  openingTime: "Restaurant opening time",
  closingTime: "Restaurant closing time",
  reservationSlotDuration: "Minutes per reservation slot",
  maxReservationsPerDay: "Maximum daily reservations",
  maxGuestsPerReservation: "Maximum guests per reservation",
  advanceBookingDays: "Days in advance for booking",
  allowReservations: "Enable/disable reservations"
}
```

This comprehensive reservation management system provides complete control over restaurant bookings with advanced filtering, bulk operations, and notification capabilities.
