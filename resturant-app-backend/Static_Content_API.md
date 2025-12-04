# Static Content API

This document describes the Branches endpoints for public and admin usage.

**Notes**

- Admin endpoints require JWT authentication and admin role: middleware `authenticateJWT` + `requireRole(["admin"])`.
- `openingHours` and `meta` fields are stored as JSON in the database.

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

- Branch
  ```json
  {
    "id": 1,
    "name": "Downtown",
    "address": "string",
    "phone": "string",
    "latitude": 24.7136,
    "longitude": 46.6753,
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string",
    "landmark": "string",
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
