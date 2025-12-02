# Static Content API

This document describes the Static Pages and Branches endpoints for public and admin usage.

**Notes**

- Admin endpoints require JWT authentication and admin role: middleware `authenticateJWT` + `requireRole(["admin"])`.
- `featuredItems`, `featuredReviews`, `chefs`, `openingHours`, and `meta` fields are stored as JSON in the database.

---

## Pages (Static content)

### Public

- **GET** `/pages/:slug`
  - Description: Retrieve a page by its `slug` (e.g. `home`, `about`).
  - Parameters: `slug` (path)
  - Response: 200
    ```json
    {
      "id": 1,
      "slug": "home",
      "title": "Welcome",
      "heroImage": "https://.../hero.jpg",
      "content": "<p>HTML or markdown content</p>",
      "featuredItems": [{ "mealId": 12, "order": 1 }],
      "featuredReviews": [{ "author": "Aya", "text": "Great!", "rating": 5 }],
      "chefs": [{ "name": "Chef Ahmed", "bio": "...", "photo": "..." }],
      "meta": { "seoTitle": "...", "description": "..." },
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-02T00:00:00.000Z"
    }
    ```

### Admin

- **GET** `/pages`

  - Description: List all pages (admin). Supports optional query params `?active=true|false`, `?page=1&limit=20`.
  - Response: 200
    ```json
    [{ "id": 1, "slug": "home", "title": "Home", "isActive": true }, ...]
    ```

- **POST** `/pages`

  - Description: Create a new static page (admin only).
  - Body (application/json):
    ```json
    {
      "slug": "about",
      "title": "About Us",
      "heroImage": "https://.../about-hero.jpg",
      "content": "<p>About content</p>",
      "featuredItems": [{ "mealId": 5, "order": 1 }],
      "featuredReviews": [{ "author": "Omar", "text": "Awesome", "rating": 5 }],
      "chefs": [{ "name": "Chef Name", "bio": "...", "photo": "..." }],
      "meta": { "seoTitle": "About", "description": "About description" },
      "isActive": true
    }
    ```
  - Response: 201
    ```json
    {
      "message": "Page created",
      "page": {
        /* page object */
      }
    }
    ```

- **PUT** `/pages/:id`

  - Description: Update page fields (admin).
  - Body: same as POST (only include fields to update)
  - Response: 200
    ```json
    {
      "message": "Page updated",
      "page": {
        /* updated page */
      }
    }
    ```

- **DELETE** `/pages/:id`

  - Description: Delete a page (admin).
  - Response: 200
    ```json
    { "message": "Page deleted" }
    ```

- **PUT** `/pages/:id/hero`

  - Description: Update hero section fields for a page (admin).
  - Body (application/json):
    ```json
    {
      "heroImage": "https://.../new-hero.jpg",
      "heroTitle": "New title",
      "heroSubtitle": "Sub text",
      "heroCTA": { "text": "Order Now", "url": "/menu" }
    }
    ```
  - Response: 200
    ```json
    {
      "message": "Hero updated",
      "page": {
        /* page */
      }
    }
    ```

- **PUT** `/pages/:id/featured-items`

  - Description: Set or update the featured items block (admin).
  - Body: `featuredItems` is stored as JSON and can be an array of meal ids or objects with ordering.
    ```json
    {
      "featuredItems": [
        { "mealId": 12, "order": 1 },
        { "mealId": 7, "order": 2 }
      ]
    }
    ```
  - Response: 200
    ```json
    {
      "message": "Featured items updated",
      "page": {
        /* page */
      }
    }
    ```

- **PUT** `/pages/:id/featured-reviews`
  - Description: Set or update featured reviews shown on the page (admin).
  - Body:
    ```json
    {
      "featuredReviews": [
        { "author": "Mona", "text": "Excellent", "rating": 5 }
      ]
    }
    ```
  - Response: 200
    ```json
    {
      "message": "Featured reviews updated",
      "page": {
        /* page */
      }
    }
    ```

---

## Branches

### Public

- **GET** `/branches`

  - Description: Retrieve list of branches with contact information and opening hours.
  - Response: 200
    ```json
    [
      {
        "id": 1,
        "name": "Downtown Branch",
        "address": "123 Main St, City",
        "phone": "+96650000000",
        "latitude": 24.7136,
        "longitude": 46.6753,
        "city": "Riyadh",
        "state": "Riyadh Province",
        "country": "Saudi Arabia",
        "zipCode": "11564",
        "landmark": "Near King Fahd Road",
        "openingHours": {
          "monday": { "open": "09:00", "close": "22:00" },
          "tuesday": { "open": "09:00", "close": "22:00" }
        },
        "isActive": true,
        "meta": {}
      }
    ]
    ```

- **GET** `/branches/:id`

  - Description: Get a single branch by id.
  - Response: 200 -> branch object (as above)

- **GET** `/branches/search`
  - Description: Search branches by location or text.
  - Query Parameters: `city`, `state`, `country`, `search`
  - Response: 200 -> array of matching branches

### Admin

- **POST** `/branches`

  - Description: Create a new branch (admin).
  - Body:
    ```json
    {
      "name": "New Branch",
      "address": "456 New Ave",
      "phone": "+9665xxxxxxx",
      "latitude": 24.7136,
      "longitude": 46.6753,
      "city": "Riyadh",
      "state": "Riyadh Province",
      "country": "Saudi Arabia",
      "zipCode": "11564",
      "landmark": "Near Mall",
      "openingHours": {
        "monday": { "open": "10:00", "close": "23:00" },
        "tuesday": { "open": "10:00", "close": "23:00" }
      },
      "isActive": true,
      "meta": { "mapUrl": "https://maps.google..." }
    }
    ```
  - Response: 201
    ```json
    {
      "message": "Branch created successfully",
      "branch": {
        /* branch object */
      }
    }
    ```

- **PUT** `/branches/:id`

  - Description: Update branch fields (admin).
  - Body: same as POST (partial allowed)
  - Response: 200
    ```json
    {
      "message": "Branch updated successfully",
      "branch": {
        /* updated branch */
      }
    }
    ```

- **PUT** `/branches/:id/location`

  - Description: Update branch location specifically (admin).
  - Body:
    ```json
    {
      "latitude": 24.7136,
      "longitude": 46.6753,
      "address": "New address",
      "city": "Riyadh",
      "state": "Riyadh Province",
      "country": "Saudi Arabia",
      "zipCode": "11564",
      "landmark": "Near landmark"
    }
    ```
  - Response: 200
    ```json
    {
      "message": "Branch location updated successfully",
      "data": {
        /* updated branch */
      }
    }
    ```

- **DELETE** `/branches/:id`
  - Description: Delete a branch (admin).
  - Response: 200
    ```json
    { "message": "Branch deleted successfully" }
    ```

---

## Working Days & Hours Management

### Admin Only

- **GET** `/restaurant/working-days`

  - Description: Get all working days for the restaurant.
  - Response: 200
    ```json
    [
      {
        "id": "uuid",
        "name": "Monday",
        "startHour": "09:00:00",
        "endHour": "22:00:00",
        "isActive": true
      }
    ]
    ```

- **GET** `/restaurant/working-days/:id`

  - Description: Get a single working day by ID.
  - Response: 200 -> working day object

- **POST** `/restaurant/working-days`

  - Description: Create a new working day.
  - Body:
    ```json
    {
      "name": "Monday",
      "startHour": "09:00",
      "endHour": "22:00"
    }
    ```
  - Response: 201
    ```json
    {
      "message": "Working day added successfully",
      "data": {
        /* working day */
      }
    }
    ```

- **PUT** `/restaurant/working-days/:id`

  - Description: Update a working day.
  - Body: same as POST (partial allowed)
  - Response: 200
    ```json
    {
      "message": "Working day updated successfully",
      "data": {
        /* working day */
      }
    }
    ```

- **PUT** `/restaurant/working-days/bulk`

  - Description: Bulk update multiple working days.
  - Body:
    ```json
    {
      "workingDays": [
        { "id": "uuid1", "startHour": "08:00", "endHour": "23:00" },
        { "id": "uuid2", "isActive": false }
      ]
    }
    ```
  - Response: 200
    ```json
    {
      "message": "Working days updated successfully",
      "data": [
        /* updated working days */
      ]
    }
    ```

- **PATCH** `/restaurant/working-days/:id/toggle`

  - Description: Toggle working day active status.
  - Response: 200
    ```json
    {
      "message": "Working day activated/deactivated successfully",
      "data": {
        /* working day */
      }
    }
    ```

- **DELETE** `/restaurant/working-days/:id`
  - Description: Delete (deactivate) a working day.
  - Response: 200
    ```json
    { "message": "Working day deleted successfully" }
    ```

---

## Data Models (quick reference)

- Page

  ```json
  {
    "id": 1,
    "slug": "home",
    "title": "Home",
    "heroImage": "string",
    "content": "string",
    "featuredItems": [],
    "featuredReviews": [],
    "chefs": [],
    "meta": {},
    "isActive": true,
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
  ```

- Branch
  ```json
  {
    "id": 1,
    "name": "Downtown",
    "address": "string",
    "phone": "string",
    "openingHours": { "monday": { "open": "09:00", "close": "22:00" } },
    "isActive": true,
    "meta": {},
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
  ```

---

If you want, I can also:

- Add sample cURL commands for each endpoint.
- Add Arabic translations for the parameter descriptions and examples.
- Run a quick smoke test script to hit these endpoints locally (requires server running).
