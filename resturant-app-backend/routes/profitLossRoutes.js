const express = require("express");
const router = express.Router();
const {
  getFinancialSummary,
  getRevenueVsExpenses,
  getRevenueBreakdown,
  getExpenseBreakdown,
  getProfitTrend,
} = require("../controllers/profitLoss");

// Import authentication middleware
const { authenticateJWT } = require("../middlewares/auth");

// Apply authentication to all profit/loss routes
router.use(authenticateJWT);

/**
 * @route GET /api/profit-loss/financial-summary
 * @desc Get financial summary cards (Total Revenue, Expenses, Net Profit, Profit Margin)
 * @access Private
 * @query {string} startDate - Start date (YYYY-MM-DD) - optional
 * @query {string} endDate - End date (YYYY-MM-DD) - optional
 * @query {string} previousPeriodStart - Previous period start date - optional
 * @query {string} previousPeriodEnd - Previous period end date - optional
 */
router.get("/financial-summary", getFinancialSummary);

/**
 * @route GET /api/profit-loss/revenue-vs-expenses
 * @desc Get revenue vs expenses data for charts
 * @access Private
 * @query {string} startDate - Start date (YYYY-MM-DD) - optional
 * @query {string} endDate - End date (YYYY-MM-DD) - optional
 * @query {string} period - Aggregation period: daily, weekly, monthly, yearly - optional (default: monthly)
 */
router.get("/revenue-vs-expenses", getRevenueVsExpenses);

/**
 * @route GET /api/profit-loss/revenue-breakdown
 * @desc Get detailed revenue breakdown by meals and categories
 * @access Private
 * @query {string} startDate - Start date (YYYY-MM-DD) - optional
 * @query {string} endDate - End date (YYYY-MM-DD) - optional
 */
router.get("/revenue-breakdown", getRevenueBreakdown);

/**
 * @route GET /api/profit-loss/expense-breakdown
 * @desc Get detailed expense breakdown (currently employee salaries)
 * @access Private
 */
router.get("/expense-breakdown", getExpenseBreakdown);

/**
 * @route GET /api/profit-loss/profit-trend
 * @desc Get profit trend analysis over time
 * @access Private
 * @query {number} months - Number of months to analyze (default: 12)
 */
router.get("/profit-trend", getProfitTrend);

module.exports = router;
