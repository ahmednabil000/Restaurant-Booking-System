# 🍽️ Restaurant Menu Management API Documentation

This document provides comprehensive API documentation for the Restaurant Menu Management system, including endpoints for managing food categories (tags) and dishes.

## 📋 **فئات الطعام (Tags) - API Documentation**

### 🔹 **1. Get All Tags**

- **Method:** `GET`
- **Endpoint:** `/tags`
- **Authentication:** None (Public)
- **Request Parameters:** None

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "title": "نباتي",
      "titleColor": "#fff",
      "bgColor": "#28a745"
    },
    {
      "id": "uuid-string",
      "title": "حار",
      "titleColor": "#fff",
      "bgColor": "#dc3545"
    }
  ],
  "message": "Tags retrieved successfully"
}
```

### 🔹 **2. Create New Tag**

- **Method:** `POST`
- **Endpoint:** `/tags/create`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

**Request Body:**

```json
{
  "title": "الأكثر طلباً",
  "titleColor": "#ffffff",
  "bgColor": "#007bff"
}
```

**Required Fields:**

- `title` (string): Tag name (required)

**Optional Fields:**

- `titleColor` (string): Text color (default: "#fff")
- `bgColor` (string): Background color (default: "#007bff")

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "الأكثر طلباً",
    "titleColor": "#ffffff",
    "bgColor": "#007bff",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z"
  },
  "message": "Tag created successfully"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Tag title is required"
}
```

**Response (Error - 409):**

```json
{
  "success": false,
  "message": "Tag with this title already exists"
}
```

### 🔹 **3. Update Tag**

- **Method:** `PUT`
- **Endpoint:** `/tags/:id`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

**URL Parameters:**

- `id` (string): Tag UUID (required)

**Request Body:**

```json
{
  "title": "عضوي",
  "titleColor": "#000000",
  "bgColor": "#28a745"
}
```

**All fields are optional - only provided fields will be updated**

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "tag-uuid",
    "title": "عضوي",
    "titleColor": "#000000",
    "bgColor": "#28a745",
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T11:00:00.000Z"
  },
  "message": "Tag updated successfully"
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Tag not found"
}
```

### 🔹 **4. Delete Tag**

- **Method:** `DELETE`
- **Endpoint:** `/tags/:id`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`

**URL Parameters:**

- `id` (string): Tag UUID (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Tag removed successfully"
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Tag not found"
}
```

### 🔹 **5. Get Meals by Tag**

- **Method:** `GET`
- **Endpoint:** `/tags/meals`
- **Authentication:** None (Public)

**Query Parameters:**

- `tags` (string, required): Space-separated tag IDs

**Example:** `/tags/meals?tags=tag-id-1 tag-id-2`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "requestedTagIds": ["tag-id-1", "tag-id-2"],
    "foundTags": [
      {
        "id": "tag-id-1",
        "title": "نباتي",
        "titleColor": "#fff",
        "bgColor": "#28a745"
      }
    ],
    "meals": [
      {
        "id": "meal-uuid",
        "title": "سلطة خضار",
        "description": "سلطة طازجة من الخضروات",
        "price": "25.00",
        "imageUrl": "image-url",
        "category": "فطور",
        "type": "breakfast",
        "isAvailable": true,
        "tags": [
          {
            "id": "tag-id-1",
            "title": "نباتي",
            "titleColor": "#fff",
            "bgColor": "#28a745"
          }
        ]
      }
    ],
    "totalMeals": 1
  },
  "message": "Found 1 meals containing at least one of the specified tags"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Tags parameter is required"
}
```

### 🔹 **6. Remove Tag from Specific Meal**

- **Method:** `DELETE`
- **Endpoint:** `/tags/meals/:mealId/:tagId`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`

**URL Parameters:**

- `mealId` (string): Meal UUID (required)
- `tagId` (string): Tag UUID (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Tag removed from meal successfully"
}
```

---

## 🍽️ **الأطباق (Dishes) - API Documentation**

### 🔹 **1. Get All Meals**

- **Method:** `GET`
- **Endpoint:** `/meals`
- **Authentication:** None (Public)

**Query Parameters (all optional):**

- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `type` (string): Filter by type (breakfast/lunch/dinner)
- `isAvailable` (boolean): Filter by availability
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in title/description
- `sortBy` (string): Sort field (title, price, createdAt, etc.)
- `sortOrder` (string): Sort order (ASC/DESC)

**Example:** `/meals?page=1&pageSize=5&category=فطور&isAvailable=true&sortBy=price&sortOrder=ASC`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "meals": [
      {
        "id": "meal-uuid",
        "title": "فطيرة الجبن",
        "description": "فطيرة لذيذة بالجبن الطازج",
        "price": "30.00",
        "imageUrl": "image-url",
        "category": "فطور",
        "type": "breakfast",
        "isAvailable": true,
        "createdAt": "2025-12-01T10:00:00.000Z",
        "updatedAt": "2025-12-01T10:00:00.000Z",
        "tags": [
          {
            "id": "tag-uuid",
            "title": "نباتي",
            "bgColor": "#28a745"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    },
    "filters": {
      "category": "فطور",
      "type": null,
      "isAvailable": true,
      "minPrice": null,
      "maxPrice": null,
      "search": null,
      "sortBy": "price",
      "sortOrder": "ASC"
    }
  }
}
```

### 🔹 **2. Search Meals**

- **Method:** `GET`
- **Endpoint:** `/meals/search`
- **Authentication:** None (Public)

**Query Parameters:**

- `searchQuery` (string, required): Search term
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Items per page (default: 10)

**Example:** `/meals/search?searchQuery=جبن&page=1&pageSize=5`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "meals": [
      {
        "id": "meal-uuid",
        "title": "فطيرة الجبن",
        "description": "فطيرة لذيذة بالجبن الطازج",
        "price": "30.00",
        "imageUrl": "image-url",
        "category": "فطور",
        "type": "breakfast",
        "isAvailable": true,
        "tags": [
          {
            "id": "tag-uuid",
            "title": "نباتي",
            "titleColor": "#fff",
            "bgColor": "#28a745"
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 5,
      "totalItems": 3,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "searchQuery": "جبن"
  },
  "message": "Found 3 meals matching \"جبن\""
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Search query is required"
}
```

### 🔹 **3. Get Meal by ID**

- **Method:** `GET`
- **Endpoint:** `/meals/:id`
- **Authentication:** None (Public)

**URL Parameters:**

- `id` (string): Meal UUID (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "id": "meal-uuid",
    "title": "فطيرة الجبن",
    "description": "فطيرة لذيذة بالجبن الطازج مع الخضار",
    "price": "30.00",
    "imageUrl": "image-url",
    "category": "فطور",
    "type": "breakfast",
    "isAvailable": true,
    "createdAt": "2025-12-01T10:00:00.000Z",
    "updatedAt": "2025-12-01T10:00:00.000Z",
    "tags": [
      {
        "id": "tag-uuid",
        "title": "نباتي",
        "bgColor": "#28a745"
      }
    ]
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Meal not found"
}
```

### 🔹 **4. Create New Meal**

- **Method:** `POST`
- **Endpoint:** `/meals`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

**Request Body:**

```json
{
  "title": "كباب الدجاج",
  "description": "كباب دجاج مشوي مع الخضار والأرز",
  "price": 45.5,
  "imageUrl": "https://example.com/image.jpg",
  "category": "غداء",
  "type": "lunch",
  "isAvailable": true,
  "tagIds": ["tag-uuid-1", "tag-uuid-2"]
}
```

**Required Fields:**

- `title` (string): Meal name
- `description` (string): Meal description
- `price` (number): Meal price (positive number)
- `type` (string): Meal type (breakfast/lunch/dinner)

**Optional Fields:**

- `imageUrl` (string): Image URL
- `category` (string): Category name
- `isAvailable` (boolean): Availability status (default: true)
- `tagIds` (array): Array of tag UUIDs

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Meal created successfully",
  "data": {
    "id": "generated-meal-uuid",
    "title": "كباب الدجاج",
    "description": "كباب دجاج مشوي مع الخضار والأرز",
    "price": "45.50",
    "imageUrl": "https://example.com/image.jpg",
    "category": "غداء",
    "type": "lunch",
    "isAvailable": true,
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T12:00:00.000Z",
    "tags": [
      {
        "id": "tag-uuid-1",
        "title": "حار",
        "bgColor": "#dc3545"
      }
    ]
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Title, description, price, and type are required"
}
```

### 🔹 **5. Update Meal**

- **Method:** `PUT`
- **Endpoint:** `/meals/:id`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
  - `Content-Type: application/json`

**URL Parameters:**

- `id` (string): Meal UUID (required)

**Request Body (all fields optional):**

```json
{
  "title": "كباب الدجاج المحدث",
  "description": "وصف محدث للطبق",
  "price": 50.0,
  "imageUrl": "https://example.com/new-image.jpg",
  "category": "عشاء",
  "type": "dinner",
  "isAvailable": false,
  "tagIds": ["new-tag-uuid"]
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Meal updated successfully",
  "data": {
    "id": "meal-uuid",
    "title": "كباب الدجاج المحدث",
    "description": "وصف محدث للطبق",
    "price": "50.00",
    "isAvailable": false,
    "updatedAt": "2025-12-01T13:00:00.000Z",
    "tags": [
      {
        "id": "new-tag-uuid",
        "title": "بروتين عالي",
        "bgColor": "#17a2b8"
      }
    ]
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Meal not found"
}
```

### 🔹 **6. Delete Meal**

- **Method:** `DELETE`
- **Endpoint:** `/meals/:id`
- **Authentication:** Admin JWT required
- **Headers:**
  - `Authorization: Bearer <jwt-token>`

**URL Parameters:**

- `id` (string): Meal UUID (required)

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Meal deleted successfully"
}
```

**Response (Error - 400 - Meal in Cart):**

```json
{
  "success": false,
  "message": "Cannot delete meal that is currently in active carts. Please remove from carts first or mark as unavailable."
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Meal not found"
}
```

---

## 🔍 **Search Features (ميزات البحث)**

The system provides comprehensive search capabilities:

### **1. Text Search**

- Search in meal titles, descriptions, and categories
- Case-insensitive search using `ILIKE`
- Supports Arabic and English text
- Prioritizes exact matches in titles

### **2. Advanced Filtering**

- **Category Filter:** Filter by meal categories (فطور، غداء، عشاء، مشروبات، حلويات)
- **Type Filter:** Filter by meal types (breakfast, lunch, dinner)
- **Price Range:** Filter by minimum and maximum price
- **Availability:** Show only available or unavailable meals
- **Tag-based:** Find meals with specific tags

### **3. Sorting Options**

- Sort by: title, price, createdAt, updatedAt
- Sort order: ASC (ascending) or DESC (descending)
- Default: Sort by title ascending

### **4. Pagination**

- All search results support pagination
- Configurable page size (default: 10 items per page)
- Includes pagination metadata (total items, pages, navigation info)

### **5. Combined Search**

- Use multiple filters simultaneously
- Combine text search with filters
- Real-time availability filtering
- Performance optimized with proper database indexing

### **Example Complex Search:**

```
GET /meals?search=دجاج&category=غداء&minPrice=20&maxPrice=60&isAvailable=true&sortBy=price&sortOrder=ASC&page=1&pageSize=5
```

This will find all available lunch meals containing "دجاج" priced between 20-60, sorted by price ascending, showing first 5 results.

---

## 🔐 **Authentication**

### **JWT Token Requirements**

Admin endpoints require JWT authentication:

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### **Error Responses**

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

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message"
}
```

---

## 📊 **Data Models**

### **Tag Model**

```javascript
{
  id: "UUID string",
  title: "Tag name",
  titleColor: "Hex color for text",
  bgColor: "Hex color for background",
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

### **Meal Model**

```javascript
{
  id: "UUID string",
  title: "Meal name",
  description: "Meal description",
  price: "Decimal string",
  imageUrl: "Image URL",
  category: "Category string",
  type: "breakfast|lunch|dinner",
  isAvailable: "Boolean",
  createdAt: "ISO date string",
  updatedAt: "ISO date string",
  tags: [Tag objects]
}
```

---

## 📝 **Usage Examples**

### **Creating a New Tag:**

```bash
curl -X POST http://localhost:3000/tags/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "نباتي",
    "titleColor": "#ffffff",
    "bgColor": "#28a745"
  }'
```

### **Searching for Meals:**

```bash
curl "http://localhost:3000/meals/search?searchQuery=دجاج&page=1&pageSize=10"
```

### **Creating a New Meal:**

```bash
curl -X POST http://localhost:3000/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "شاورما الدجاج",
    "description": "شاورما دجاج بالخضار والثومية",
    "price": 25.50,
    "category": "غداء",
    "type": "lunch",
    "isAvailable": true,
    "tagIds": ["tag-uuid-1", "tag-uuid-2"]
  }'
```

This API provides a complete menu management system with full CRUD operations, advanced search capabilities, and proper authentication for administrative functions.
