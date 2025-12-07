# Reservation Details API Update

## Overview

Enhanced reservation endpoints to include detailed cart information with meals, quantities, and total amounts for comprehensive reservation display in the dashboard.

---

## Updated Endpoints

### 1. Get All Reservations

**Endpoint:** `GET /api/reservations`

**Enhanced Response Structure:**

```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "reservation_123",
        "fullName": "Ahmed Hassan",
        "phone": "+201234567890",
        "date": "2025-12-10",
        "startTime": "19:00:00",
        "endTime": "21:00:00",
        "partySize": 4,
        "status": "confirmed",
        "specialRequests": "Window seat if possible",
        "tableNumber": "T-05",
        "user": {
          "id": "user_123",
          "fullName": "Ahmed Hassan",
          "email": "ahmed@example.com"
        },
        "cart": {
          "id": "cart_456",
          "itemsTotal": 214.5,
          "serviceFees": 31.0,
          "totalAmount": 245.5,
          "status": "completed",
          "cartItems": [
            {
              "id": "item_1",
              "quantity": 2,
              "unitPrice": 45.0,
              "totalPrice": 90.0,
              "specialInstructions": "Extra spicy",
              "meal": {
                "id": "meal_1",
                "title": "Grilled Chicken",
                "price": 45.0,
                "imageUrl": "https://example.com/chicken.jpg",
                "category": "Main Course"
              }
            },
            {
              "id": "item_2",
              "quantity": 3,
              "unitPrice": 25.5,
              "totalPrice": 76.5,
              "specialInstructions": null,
              "meal": {
                "id": "meal_2",
                "title": "Caesar Salad",
                "price": 25.5,
                "imageUrl": "https://example.com/salad.jpg",
                "category": "Appetizers"
              }
            },
            {
              "id": "item_3",
              "quantity": 4,
              "unitPrice": 12.0,
              "totalPrice": 48.0,
              "specialInstructions": null,
              "meal": {
                "id": "meal_3",
                "title": "Fresh Juice",
                "price": 12.0,
                "imageUrl": "https://example.com/juice.jpg",
                "category": "Beverages"
              }
            }
          ]
        },
        "createdAt": "2025-12-05T10:30:00.000Z",
        "updatedAt": "2025-12-05T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "pages": 15,
      "limit": 10
    }
  },
  "message": "Reservations retrieved successfully"
}
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled, no-show, rejected)
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `startDate` (optional): Filter by date range start
- `endDate` (optional): Filter by date range end
- `userId` (optional): Filter by user ID
- `userEmail` (optional): Filter by user email

---

### 2. Get Reservation By ID

**Endpoint:** `GET /api/reservations/:id`

**Enhanced Response Structure:**

```json
{
  "success": true,
  "data": {
    "id": "reservation_123",
    "fullName": "Ahmed Hassan",
    "phone": "+201234567890",
    "date": "2025-12-10",
    "startTime": "19:00:00",
    "endTime": "21:00:00",
    "partySize": 4,
    "status": "confirmed",
    "specialRequests": "Window seat if possible",
    "rejectionReason": null,
    "tableNumber": "T-05",
    "userId": "user_123",
    "cartId": "cart_456",
    "rate": null,
    "confirmationToken": "token_abc123",
    "user": {
      "id": "user_123",
      "fullName": "Ahmed Hassan",
      "email": "ahmed@example.com"
    },
    "cart": {
      "id": "cart_456",
      "itemsTotal": 214.5,
      "serviceFees": 31.0,
      "totalAmount": 245.5,
      "status": "completed",
      "createdAt": "2025-12-05T10:25:00.000Z",
      "updatedAt": "2025-12-05T10:30:00.000Z",
      "cartItems": [
        {
          "id": "item_1",
          "quantity": 2,
          "unitPrice": 45.0,
          "totalPrice": 90.0,
          "specialInstructions": "Extra spicy",
          "meal": {
            "id": "meal_1",
            "title": "Grilled Chicken",
            "description": "Tender grilled chicken breast with herbs",
            "price": 45.0,
            "imageUrl": "https://example.com/chicken.jpg",
            "category": "Main Course"
          }
        },
        {
          "id": "item_2",
          "quantity": 3,
          "unitPrice": 25.5,
          "totalPrice": 76.5,
          "specialInstructions": null,
          "meal": {
            "id": "meal_2",
            "title": "Caesar Salad",
            "description": "Fresh romaine lettuce with Caesar dressing",
            "price": 25.5,
            "imageUrl": "https://example.com/salad.jpg",
            "category": "Appetizers"
          }
        },
        {
          "id": "item_3",
          "quantity": 4,
          "unitPrice": 12.0,
          "totalPrice": 48.0,
          "specialInstructions": null,
          "meal": {
            "id": "meal_3",
            "title": "Fresh Juice",
            "description": "100% natural fresh fruit juice",
            "price": 12.0,
            "imageUrl": "https://example.com/juice.jpg",
            "category": "Beverages"
          }
        }
      ]
    },
    "createdAt": "2025-12-05T10:30:00.000Z",
    "updatedAt": "2025-12-05T10:30:00.000Z"
  },
  "message": "Reservation retrieved successfully"
}
```

---

## New Data Fields Included

### Cart Object

- **`id`**: Unique cart identifier
- **`itemsTotal`**: Sum of all cart item prices (before service fees)
- **`serviceFees`**: Restaurant service fees from restaurant configuration
- **`totalAmount`**: Total cost including items and service fees (itemsTotal + serviceFees)
- **`status`**: Cart status (active, completed, abandoned)
- **`createdAt`**: Cart creation timestamp
- **`updatedAt`**: Last cart update timestamp

### Cart Items Array

Each cart item includes:

- **`id`**: Unique cart item identifier
- **`quantity`**: Number of items ordered
- **`unitPrice`**: Price per single item
- **`totalPrice`**: Total price (quantity × unitPrice)
- **`specialInstructions`**: Customer's special requests for this item

### Meal Object (within each cart item)

- **`id`**: Unique meal identifier
- **`title`**: Meal name
- **`description`**: Meal description (only in detail view)
- **`price`**: Current meal price
- **`imageUrl`**: Meal image URL
- **`category`**: Meal category (Main Course, Appetizers, Beverages, etc.)

---

## Use Cases

### 1. Dashboard Reservations List

Display key information for each reservation:

```javascript
// Example: Display reservation summary
reservations.forEach((reservation) => {
  const itemCount = reservation.cart?.cartItems?.length || 0;
  const totalAmount = reservation.cart?.totalAmount || 0;

  console.log(`
    ${reservation.fullName} - Table ${reservation.tableNumber}
    Party Size: ${reservation.partySize}
    Items: ${itemCount} | Total: $${totalAmount}
    Status: ${reservation.status}
  `);
});
```

### 2. Reservation Detail View

Show complete order breakdown:

```javascript
// Example: Display meal breakdown
const reservation = data.data;
console.log(`Reservation for ${reservation.fullName}`);
console.log(`Date: ${reservation.date} at ${reservation.startTime}`);
console.log("\nOrder Details:");

reservation.cart?.cartItems?.forEach((item) => {
  console.log(`
    ${item.meal.title}
    Quantity: ${item.quantity} × $${item.unitPrice} = $${item.totalPrice}
    ${item.specialInstructions ? `Note: ${item.specialInstructions}` : ""}
  `);
});

console.log(`\nItems Total: $${reservation.cart?.itemsTotal}`);
console.log(`Service Fees: $${reservation.cart?.serviceFees}`);
console.log(`Total Amount: $${reservation.cart?.totalAmount}`);
```

### 3. Calculate Order Statistics

```javascript
// Example: Analyze order composition
const cartItems = reservation.cart?.cartItems || [];

const categories = cartItems.reduce((acc, item) => {
  const category = item.meal.category;
  acc[category] = (acc[category] || 0) + item.quantity;
  return acc;
}, {});

console.log("Order Composition:", categories);
// Output: { "Main Course": 2, "Appetizers": 3, "Beverages": 4 }
```

### 4. Print Receipt / Invoice

```javascript
// Example: Generate receipt
function generateReceipt(reservation) {
  return `
    RESERVATION RECEIPT
    ==================
    Reservation ID: ${reservation.id}
    Customer: ${reservation.fullName}
    Date: ${reservation.date}
    Time: ${reservation.startTime} - ${reservation.endTime}
    Table: ${reservation.tableNumber}
    Party Size: ${reservation.partySize}
    
    ORDER DETAILS
    -------------
    ${reservation.cart?.cartItems
      ?.map(
        (item) => `
    ${item.meal.title}
    ${item.quantity} × $${item.unitPrice} = $${item.totalPrice}
    ${item.specialInstructions ? `Special: ${item.specialInstructions}` : ""}
    `
      )
      .join("\n")}
    
    SUBTOTAL: $${reservation.cart?.itemsTotal}
    SERVICE FEES: $${reservation.cart?.serviceFees}
    TOTAL: $${reservation.cart?.totalAmount}
    
    ${
      reservation.specialRequests
        ? `Special Requests: ${reservation.specialRequests}`
        : ""
    }
  `;
}
```

---

## Benefits

### 📊 **Complete Order Visibility**

- View all ordered meals in one request
- See quantities and prices per item
- Track special instructions for each item

### 💰 **Financial Tracking**

- Total amount clearly displayed
- Individual item pricing available
- Easy revenue calculation and reporting

### 📱 **Better Dashboard UX**

- No need for multiple API calls
- All data loaded in one request
- Faster page rendering

### 📈 **Analytics Ready**

- Analyze popular meals per reservation
- Track average order values
- Monitor ordering patterns

### 🖨️ **Receipt Generation**

- All data needed for invoices
- Complete order breakdown available
- Easy to format for printing

---

## Notes

1. **Cart may be null**: If a reservation doesn't have an associated cart (old reservations), the `cart` field will be `null`
2. **Empty cart items**: If cart has no items, `cartItems` will be an empty array `[]`
3. **Backward compatible**: Existing code will continue to work; new fields are additional
4. **Performance**: Includes all data in single query using SQL joins (efficient)
5. **Left Join**: Uses LEFT JOIN so reservations without carts are still returned

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP Status Codes:

- `200` - Success
- `404` - Reservation not found
- `500` - Internal server error
