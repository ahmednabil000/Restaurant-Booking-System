# Profit & Loss Dashboard API Documentation

This document describes the endpoints for the Profit & Loss Dashboard (صفحة الأرباح والخسائر).

## Base URL

```
/profit-loss
```

## Authentication

All endpoints require authentication. Include the authorization token in the request headers:

```
Authorization: Bearer <your_token>
```

Note: These endpoints use JWT-based authentication via the `authenticateJWT` middleware.

---

## 1. Financial Summary Cards

Get the main financial summary cards for the dashboard.

**Endpoint:** `GET /profit-loss/financial-summary`

**Query Parameters:**

- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format
- `previousPeriodStart` (optional): Previous period start for comparison
- `previousPeriodEnd` (optional): Previous period end for comparison

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRevenue": {
      "amount": 15000.5,
      "changePercentage": 12.5,
      "trend": "up",
      "previousAmount": 13334.67
    },
    "totalExpenses": {
      "amount": 8000.0,
      "changePercentage": 2.3,
      "trend": "up",
      "previousAmount": 7820.0
    },
    "netProfit": {
      "amount": 7000.5,
      "changePercentage": 25.8,
      "trend": "up",
      "previousAmount": 5514.67
    },
    "profitMargin": {
      "percentage": 46.67,
      "changePercentage": 5.2,
      "trend": "up",
      "previousPercentage": 41.47
    },
    "period": {
      "start": "2024-12-01",
      "end": "2024-12-05",
      "previousStart": "2024-11-26",
      "previousEnd": "2024-11-30"
    }
  }
}
```

---

## 2. Revenue vs Expenses Data

Get data for revenue vs expenses charts.

**Endpoint:** `GET /profit-loss/revenue-vs-expenses`

**Query Parameters:**

- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format
- `period` (optional): Aggregation period - `daily`, `weekly`, `monthly`, `yearly` (default: `monthly`)

**Response:**

```json
{
  "success": true,
  "data": {
    "chartData": [
      {
        "period": "2024-07",
        "revenue": 12000.0,
        "expenses": 8000.0,
        "profit": 4000.0,
        "profitMargin": 33.33
      },
      {
        "period": "2024-08",
        "revenue": 13500.0,
        "expenses": 8000.0,
        "profit": 5500.0,
        "profitMargin": 40.74
      }
    ],
    "summary": {
      "totalRevenue": 75000.0,
      "totalExpenses": 48000.0,
      "totalProfit": 27000.0,
      "period": "monthly",
      "startDate": "2024-07-01",
      "endDate": "2024-12-05"
    }
  }
}
```

---

## 3. Revenue Breakdown

Get detailed revenue breakdown by meals and categories.

**Endpoint:** `GET /profit-loss/revenue-breakdown`

**Query Parameters:**

- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

**Response:**

```json
{
  "success": true,
  "data": {
    "topSellingMeals": [
      {
        "mealId": "meal_123",
        "mealName": "Grilled Chicken",
        "category": "Main Course",
        "unitPrice": 25.5,
        "totalRevenue": 2550.0,
        "totalQuantity": 100
      }
    ],
    "revenueByCategory": [
      {
        "category": "Main Course",
        "totalRevenue": 8500.0,
        "totalQuantity": 340,
        "uniqueItems": 15
      }
    ],
    "period": {
      "start": "2024-12-01",
      "end": "2024-12-05"
    }
  }
}
```

---

## 4. Expense Breakdown

Get detailed expense breakdown (currently employee salaries).

**Endpoint:** `GET /profit-loss/expense-breakdown`

**Response:**

```json
{
  "success": true,
  "data": {
    "expensesByRole": [
      {
        "role": "Manager",
        "employeeCount": 2,
        "totalSalary": 6000.0,
        "averageSalary": 3000.0,
        "percentageOfTotal": 37.5
      },
      {
        "role": "Chef",
        "employeeCount": 3,
        "totalSalary": 4500.0,
        "averageSalary": 1500.0,
        "percentageOfTotal": 28.1
      }
    ],
    "topExpenses": [
      {
        "employeeId": "emp_123",
        "fullName": "Ahmed Hassan",
        "job": "Manager",
        "salary": 3500.0,
        "hireDate": "2023-01-15"
      }
    ],
    "totalExpenses": 16000.0
  }
}
```

---

## 5. Profit Trend Analysis

Get profit trend analysis over time.

**Endpoint:** `GET /profit-loss/profit-trend`

**Query Parameters:**

- `months` (optional): Number of months to analyze (default: 12)

**Response:**

```json
{
  "success": true,
  "data": {
    "profitTrend": [
      {
        "year": 2024,
        "month": 1,
        "monthName": "January",
        "revenue": 12000.0,
        "expenses": 8000.0,
        "profit": 4000.0,
        "profitMargin": 33.33,
        "growthRate": 0
      },
      {
        "year": 2024,
        "month": 2,
        "monthName": "February",
        "revenue": 13200.0,
        "expenses": 8000.0,
        "profit": 5200.0,
        "profitMargin": 39.39,
        "growthRate": 30.0
      }
    ],
    "summary": {
      "totalRevenue": 156000.0,
      "totalExpenses": 96000.0,
      "totalProfit": 60000.0,
      "averageMonthlyProfit": 5000.0,
      "trendDirection": "upward",
      "periodMonths": 12
    }
  }
}
```

---

## Features Supported

### 📌 1. إجمالي الإيرادات (Total Revenue)

- Shows total sales for the specified period
- Percentage change compared to previous period
- Up/down trend indicators

### 📌 2. إجمالي المصروفات (Total Expenses)

- Currently tracks employee salaries
- Can be extended for other expenses (rent, utilities, ingredients)
- Comparison with previous periods

### 📌 3. الربح الصافي (Net Profit)

- Net Profit = Revenue - Expenses
- Trend analysis and growth rates

### 📌 4. هامش الربح (Profit Margin)

- (Net Profit / Revenue) × 100
- Performance indicators (green/red)

### 📈 Revenue vs Expenses Charts

- Support for different time periods (daily, weekly, monthly, yearly)
- Revenue and expense comparison
- Profit gap visualization

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Notes

1. All monetary values are returned as numbers with 2 decimal places
2. Dates should be provided in YYYY-MM-DD format
3. If no date range is specified, defaults to current month
4. Expense calculation currently focuses on employee salaries
5. All endpoints require valid authentication tokens
6. Data is filtered by cart status 'completed' for accurate revenue calculation
