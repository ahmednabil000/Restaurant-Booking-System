const { Op } = require("sequelize");
const sequelize = require("../database/sequalize");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Employee = require("../models/employee");
const Meal = require("../models/meal");

/**
 * Get Financial Summary Cards
 * Returns: Total Revenue, Total Expenses, Net Profit, Profit Margin
 */
const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate, previousPeriodStart, previousPeriodEnd } =
      req.query;
    console.log(startDate);
    console.log(endDate);
    // Default to current month if no dates provided
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // For end date, set to end of day to be fully inclusive
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    // Calculate previous period for comparison (same length as current period)
    const periodLength = end.getTime() - start.getTime();
    const prevStart = previousPeriodStart
      ? new Date(previousPeriodStart)
      : new Date(start.getTime() - periodLength);

    // For previous end date, also set to end of day to be fully inclusive
    const prevEnd = previousPeriodEnd
      ? new Date(new Date(previousPeriodEnd).setHours(23, 59, 59, 999))
      : new Date(start.getTime() - 1); // One millisecond before start

    // Get current period revenue
    const currentRevenue =
      (await Cart.sum("totalAmount", {
        where: {
          status: "completed",
          updatedAt: {
            [Op.between]: [start, end],
          },
        },
      })) || 0;
    console.log(currentRevenue);
    // Get previous period revenue for comparison
    const previousRevenue =
      (await Cart.sum("totalAmount", {
        where: {
          status: "completed",
          updatedAt: {
            [Op.between]: [prevStart, prevEnd],
          },
        },
      })) || 0;

    // Calculate employee expenses (salaries)
    const activeEmployees = await Employee.findAll({
      attributes: ["salary"],
      where: {
        isActive: true,
        salary: {
          [Op.not]: null,
        },
      },
    });

    const currentExpenses = activeEmployees.reduce((total, emp) => {
      return total + parseFloat(emp.salary || 0);
    }, 0);

    // For simplicity, assume previous expenses are the same (in real scenario, you'd track historical data)
    const previousExpenses = currentExpenses;

    // Calculate profits
    const currentNetProfit = currentRevenue - currentExpenses;
    const previousNetProfit = previousRevenue - previousExpenses;

    // Calculate profit margin
    const currentProfitMargin =
      currentRevenue > 0 ? (currentNetProfit / currentRevenue) * 100 : 0;
    const previousProfitMargin =
      previousRevenue > 0 ? (previousNetProfit / previousRevenue) * 100 : 0;

    // Calculate percentage changes
    const revenueChange =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    const expensesChange =
      previousExpenses > 0
        ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
        : 0;
    const profitChange =
      previousNetProfit !== 0
        ? ((currentNetProfit - previousNetProfit) /
            Math.abs(previousNetProfit)) *
          100
        : 0;
    const marginChange = currentProfitMargin - previousProfitMargin;
    console.log(currentExpenses);
    res.json({
      success: true,
      data: {
        totalRevenue: {
          amount: parseFloat(currentRevenue.toFixed(2)),
          changePercentage: parseFloat(revenueChange.toFixed(2)),
          trend: revenueChange >= 0 ? "up" : "down",
          previousAmount: parseFloat(previousRevenue.toFixed(2)),
        },
        totalExpenses: {
          amount: parseFloat(currentExpenses.toFixed(2)),
          changePercentage: parseFloat(expensesChange.toFixed(2)),
          trend: expensesChange <= 0 ? "up" : "down", // Lower expenses are good
          previousAmount: parseFloat(previousExpenses.toFixed(2)),
        },
        netProfit: {
          amount: parseFloat(currentNetProfit.toFixed(2)),
          changePercentage: parseFloat(profitChange.toFixed(2)),
          trend: profitChange >= 0 ? "up" : "down",
          previousAmount: parseFloat(previousNetProfit.toFixed(2)),
        },
        profitMargin: {
          percentage: parseFloat(currentProfitMargin.toFixed(2)),
          changePercentage: parseFloat(marginChange.toFixed(2)),
          trend: marginChange >= 0 ? "up" : "down",
          previousPercentage: parseFloat(previousProfitMargin.toFixed(2)),
        },
        period: {
          start: start.toISOString().split("T")[0],
          end: end.toISOString().split("T")[0],
          previousStart: prevStart.toISOString().split("T")[0],
          previousEnd: prevEnd.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("Error getting financial summary:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving financial summary",
      error: error.message,
    });
  }
};

/**
 * Get Revenue vs Expenses Data for Charts
 * Supports daily, weekly, monthly, yearly aggregation
 */
const getRevenueVsExpenses = async (req, res) => {
  try {
    const { startDate, endDate, period = "monthly" } = req.query;

    // Default to last 6 months if no dates provided
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getFullYear(), end.getMonth() - 5, 1);

    let dateFormat;
    let groupBy;

    switch (period) {
      case "daily":
        dateFormat = "YYYY-MM-DD";
        groupBy = sequelize.fn("DATE", sequelize.col("updatedAt"));
        break;
      case "weekly":
        dateFormat = "YYYY-WW";
        groupBy = [
          sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
          sequelize.fn("EXTRACT", sequelize.literal('WEEK FROM "updatedAt"')),
        ];
        break;
      case "yearly":
        dateFormat = "YYYY";
        groupBy = sequelize.fn(
          "EXTRACT",
          sequelize.literal('YEAR FROM "updatedAt"')
        );
        break;
      case "monthly":
      default:
        dateFormat = "YYYY-MM";
        groupBy = [
          sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
          sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "updatedAt"')),
        ];
        break;
    }

    // Get revenue data grouped by period - using simpler PostgreSQL approach
    let revenueData;

    if (period === "daily") {
      revenueData = await Cart.findAll({
        attributes: [
          [sequelize.fn("DATE", sequelize.col("updatedAt")), "period"],
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
        ],
        where: {
          status: "completed",
          updatedAt: {
            [Op.between]: [start, end],
          },
        },
        group: [sequelize.fn("DATE", sequelize.col("updatedAt"))],
        order: [[sequelize.fn("DATE", sequelize.col("updatedAt")), "ASC"]],
        raw: true,
      });
    } else if (period === "yearly") {
      revenueData = await Cart.findAll({
        attributes: [
          [
            sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
            "period",
          ],
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
        ],
        where: {
          status: "completed",
          updatedAt: {
            [Op.between]: [start, end],
          },
        },
        group: [
          sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
        ],
        order: [
          [
            sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
            "ASC",
          ],
        ],
        raw: true,
      });
    } else {
      // Monthly (default) and weekly - use YYYY-MM format for simplicity
      revenueData = await Cart.findAll({
        attributes: [
          [sequelize.literal("TO_CHAR(\"updatedAt\", 'YYYY-MM')"), "period"],
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
        ],
        where: {
          status: "completed",
          updatedAt: {
            [Op.between]: [start, end],
          },
        },
        group: [sequelize.literal("TO_CHAR(\"updatedAt\", 'YYYY-MM')")],
        order: [
          [sequelize.literal("TO_CHAR(\"updatedAt\", 'YYYY-MM')"), "ASC"],
        ],
        raw: true,
      });
    }

    // Get total monthly employee expenses
    const activeEmployees = await Employee.findAll({
      attributes: ["salary"],
      where: {
        isActive: true,
        salary: {
          [Op.not]: null,
        },
      },
    });

    const monthlyEmployeeExpenses = activeEmployees.reduce((total, emp) => {
      return total + parseFloat(emp.salary || 0);
    }, 0);

    // Create expense data for each period (assuming static employee costs for now)
    const expenseData = revenueData.map((item) => ({
      period: item.period,
      expenses: monthlyEmployeeExpenses,
    }));

    // Combine data and calculate profit
    const combinedData = revenueData.map((revenueItem) => {
      const revenue = parseFloat(revenueItem.revenue || 0);
      const expenses = monthlyEmployeeExpenses;
      const profit = revenue - expenses;

      return {
        period: revenueItem.period,
        revenue: parseFloat(revenue.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        profitMargin:
          revenue > 0 ? parseFloat(((profit / revenue) * 100).toFixed(2)) : 0,
      };
    });

    res.json({
      success: true,
      data: {
        chartData: combinedData,
        summary: {
          totalRevenue: combinedData.reduce(
            (sum, item) => sum + item.revenue,
            0
          ),
          totalExpenses: combinedData.reduce(
            (sum, item) => sum + item.expenses,
            0
          ),
          totalProfit: combinedData.reduce((sum, item) => sum + item.profit, 0),
          period: period,
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("Error getting revenue vs expenses data:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving revenue vs expenses data",
      error: error.message,
    });
  }
};

/**
 * Get Detailed Revenue Breakdown
 * Shows revenue by meal categories, popular items, etc.
 */
const getRevenueBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    // Get revenue by meal
    const revenueByMeal = await CartItem.findAll({
      attributes: [
        "mealId",
        [sequelize.fn("SUM", sequelize.col("totalPrice")), "totalRevenue"],
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
      ],
      include: [
        {
          model: Meal,
          as: "meal",
          attributes: ["title", "category", "price"],
          required: true,
        },
        {
          model: Cart,
          as: "cart",
          attributes: [],
          where: {
            status: "completed",
            updatedAt: {
              [Op.between]: [start, end],
            },
          },
          required: true,
        },
      ],
      group: ["mealId", "meal.id"],
      order: [[sequelize.fn("SUM", sequelize.col("totalPrice")), "DESC"]],
      limit: 10,
    });

    // Get revenue by category using Sequelize ORM instead of raw SQL
    const revenueByCategory = await CartItem.findAll({
      attributes: [
        [sequelize.col("meal.category"), "category"],
        [sequelize.fn("SUM", sequelize.col("totalPrice")), "totalRevenue"],
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("mealId"))
          ),
          "uniqueItems",
        ],
      ],
      include: [
        {
          model: Meal,
          as: "meal",
          attributes: [],
          required: true,
        },
        {
          model: Cart,
          as: "cart",
          attributes: [],
          where: {
            status: "completed",
            updatedAt: {
              [Op.between]: [start, end],
            },
          },
          required: true,
        },
      ],
      group: [sequelize.col("meal.category")],
      order: [[sequelize.fn("SUM", sequelize.col("totalPrice")), "DESC"]],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        topSellingMeals: revenueByMeal.map((item) => ({
          mealId: item.mealId,
          mealName: item.meal.title,
          category: item.meal.category,
          unitPrice: parseFloat(item.meal.price),
          totalRevenue: parseFloat(item.dataValues.totalRevenue),
          totalQuantity: parseInt(item.dataValues.totalQuantity),
        })),
        revenueByCategory: revenueByCategory.map((item) => ({
          category: item.category,
          totalRevenue: parseFloat(item.totalRevenue),
          totalQuantity: parseInt(item.totalQuantity),
          uniqueItems: parseInt(item.uniqueItems),
        })),
        period: {
          start: start.toISOString().split("T")[0],
          end: end.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("Error getting revenue breakdown:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving revenue breakdown",
      error: error.message,
    });
  }
};

/**
 * Get Expense Breakdown
 * Currently shows employee salaries breakdown
 */
const getExpenseBreakdown = async (req, res) => {
  try {
    // Get expenses by employee role/position
    const expensesByRole = await Employee.findAll({
      attributes: [
        "job",
        [sequelize.fn("COUNT", sequelize.col("id")), "employeeCount"],
        [sequelize.fn("SUM", sequelize.col("salary")), "totalSalary"],
        [sequelize.fn("AVG", sequelize.col("salary")), "averageSalary"],
      ],
      where: {
        isActive: true,
        salary: {
          [Op.not]: null,
        },
      },
      group: ["job"],
      order: [[sequelize.fn("SUM", sequelize.col("salary")), "DESC"]],
    });

    // Get individual employee expenses (top 10 by salary)
    const topExpenses = await Employee.findAll({
      attributes: ["id", "fullName", "job", "salary", "hireDate"],
      where: {
        isActive: true,
        salary: {
          [Op.not]: null,
        },
      },
      order: [["salary", "DESC"]],
      limit: 10,
    });

    const totalExpenses = expensesByRole.reduce((total, role) => {
      return total + parseFloat(role.dataValues.totalSalary || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        expensesByRole: expensesByRole.map((role) => ({
          role: role.job,
          employeeCount: parseInt(role.dataValues.employeeCount),
          totalSalary: parseFloat(role.dataValues.totalSalary || 0),
          averageSalary: parseFloat(role.dataValues.averageSalary || 0),
          percentageOfTotal:
            totalExpenses > 0
              ? parseFloat(
                  ((role.dataValues.totalSalary / totalExpenses) * 100).toFixed(
                    2
                  )
                )
              : 0,
        })),
        topExpenses: topExpenses.map((emp) => ({
          employeeId: emp.id,
          fullName: emp.fullName,
          job: emp.job,
          salary: parseFloat(emp.salary),
          hireDate: emp.hireDate,
        })),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error getting expense breakdown:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving expense breakdown",
      error: error.message,
    });
  }
};

/**
 * Get Profit Trend Analysis
 * Shows profit trends over different time periods
 */
const getProfitTrend = async (req, res) => {
  try {
    const { months = 12 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    // Get monthly revenue data
    const monthlyData = await Cart.findAll({
      attributes: [
        [
          sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
          "year",
        ],
        [
          sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "updatedAt"')),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
      ],
      where: {
        status: "completed",
        updatedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [
        sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
        sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "updatedAt"')),
      ],
      order: [
        [
          sequelize.fn("EXTRACT", sequelize.literal('YEAR FROM "updatedAt"')),
          "ASC",
        ],
        [
          sequelize.fn("EXTRACT", sequelize.literal('MONTH FROM "updatedAt"')),
          "ASC",
        ],
      ],
      raw: true,
    });

    // Calculate monthly expenses (employee salaries)
    const activeEmployees = await Employee.findAll({
      attributes: ["salary"],
      where: {
        isActive: true,
        salary: { [Op.not]: null },
      },
    });

    const monthlyExpenses = activeEmployees.reduce((total, emp) => {
      return total + parseFloat(emp.salary || 0);
    }, 0);

    // Calculate profit trend
    const profitTrend = monthlyData.map((month, index) => {
      const revenue = parseFloat(month.revenue || 0);
      const expenses = monthlyExpenses;
      const profit = revenue - expenses;

      // Calculate month-over-month growth
      let growthRate = 0;
      if (index > 0) {
        const previousProfit =
          parseFloat(monthlyData[index - 1].revenue || 0) - monthlyExpenses;
        if (previousProfit !== 0) {
          growthRate =
            ((profit - previousProfit) / Math.abs(previousProfit)) * 100;
        }
      }

      return {
        year: month.year,
        month: month.month,
        monthName: new Date(month.year, month.month - 1).toLocaleDateString(
          "en-US",
          { month: "long" }
        ),
        revenue: parseFloat(revenue.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        profitMargin:
          revenue > 0 ? parseFloat(((profit / revenue) * 100).toFixed(2)) : 0,
        growthRate: parseFloat(growthRate.toFixed(2)),
      };
    });

    // Calculate overall trend metrics
    const totalRevenue = profitTrend.reduce(
      (sum, month) => sum + month.revenue,
      0
    );
    const totalExpenses = profitTrend.reduce(
      (sum, month) => sum + month.expenses,
      0
    );
    const totalProfit = totalRevenue - totalExpenses;
    const averageMonthlyProfit =
      profitTrend.length > 0 ? totalProfit / profitTrend.length : 0;

    // Determine trend direction
    const firstHalfProfit = profitTrend
      .slice(0, Math.ceil(profitTrend.length / 2))
      .reduce((sum, month) => sum + month.profit, 0);
    const secondHalfProfit = profitTrend
      .slice(Math.ceil(profitTrend.length / 2))
      .reduce((sum, month) => sum + month.profit, 0);

    const trendDirection =
      secondHalfProfit > firstHalfProfit ? "upward" : "downward";

    res.json({
      success: true,
      data: {
        profitTrend,
        summary: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalExpenses: parseFloat(totalExpenses.toFixed(2)),
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          averageMonthlyProfit: parseFloat(averageMonthlyProfit.toFixed(2)),
          trendDirection,
          periodMonths: parseInt(months),
        },
      },
    });
  } catch (error) {
    console.error("Error getting profit trend:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profit trend",
      error: error.message,
    });
  }
};

module.exports = {
  getFinancialSummary,
  getRevenueVsExpenses,
  getRevenueBreakdown,
  getExpenseBreakdown,
  getProfitTrend,
};
