import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUtensils,
  FaUsers,
  FaChartBar,
  FaClock,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import analyticsService from "../../services/analyticsService";

// StatCard Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };

  return (
    <div
      className={`p-6 rounded-lg border-2 ${colorClasses[color]} transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="text-xl" />
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <p className="text-3xl font-bold mb-1">{value}</p>
          {subtitle && (
            <div className="flex items-center gap-1 text-sm">
              {trend === "up" ? (
                <FaArrowUp className="text-green-600" />
              ) : (
                <FaArrowDown className="text-red-600" />
              )}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PopularDishCard Component
const PopularDishCard = ({ dish, rank }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
      <span className="font-bold text-orange-600">#{rank}</span>
    </div>
    <div className="shrink-0">
      <img
        src={dish.image}
        alt={dish.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-800">{dish.name}</h4>
      <p className="text-gray-600">
        <span className="font-medium">{dish.orders}</span> طلب هذا الشهر
      </p>
    </div>
    <div className="text-right">
      <FaChartBar className="text-gray-400 text-xl" />
    </div>
  </div>
);

const Overview = () => {
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState({
    day: 0,
    week: 0,
    month: 0,
    trend: "up",
  });
  const [popularDishes, setPopularDishes] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;

      setLoading(true);
      setError(null);
      try {
        const [dayResp, weekResp, monthResp, mealsResp, customersResp] =
          await Promise.all([
            analyticsService.getReservationStats("day"),
            analyticsService.getReservationStats("week"),
            analyticsService.getReservationStats("month"),
            analyticsService.getMostDemandedMeals(5, "month"),
            analyticsService.getRecentCustomers(8, 60),
          ]);

        if (!mounted) return;

        // Update all reservation stats in a single state update to avoid race conditions
        setReservations((r) => ({
          ...r,
          day:
            dayResp?.success && dayResp.data
              ? Number(dayResp.data.totalReservations || 0)
              : r.day,
          week:
            weekResp?.success && weekResp.data
              ? Number(weekResp.data.totalReservations || 0)
              : r.week,
          month:
            monthResp?.success && monthResp.data
              ? Number(monthResp.data.totalReservations || 0)
              : r.month,
        }));

        if (
          mealsResp &&
          mealsResp.success &&
          mealsResp.data &&
          Array.isArray(mealsResp.data.mostDemandedMeals)
        ) {
          const mapped = mealsResp.data.mostDemandedMeals.map((m) => ({
            id: m.meal?.id || m.meal?.name,
            name: m.meal?.name || "-",
            orders: Number(m.totalOrdered || m.orderCount || 0),
            image: m.meal?.imageUrl || "/api/placeholder/80/80",
          }));
          setPopularDishes(mapped);
        }

        if (
          customersResp &&
          customersResp.success &&
          customersResp.data &&
          Array.isArray(customersResp.data.customers)
        ) {
          setRecentCustomers(customersResp.data.customers);
        }

        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error("Error loading dashboard data:", err);
        setError(err.message || String(err));
        setLoading(false);
      }
    };

    loadData();

    // Set up polling to refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [dayResp, weekResp, monthResp, mealsResp, customersResp] =
        await Promise.all([
          analyticsService.getReservationStats("day"),
          analyticsService.getReservationStats("week"),
          analyticsService.getReservationStats("month"),
          analyticsService.getMostDemandedMeals(5, "month"),
          analyticsService.getRecentCustomers(8, 60),
        ]);

      // Update all reservation stats in a single state update to avoid race conditions
      setReservations((r) => ({
        ...r,
        day:
          dayResp?.success && dayResp.data
            ? Number(dayResp.data.totalReservations || 0)
            : r.day,
        week:
          weekResp?.success && weekResp.data
            ? Number(weekResp.data.totalReservations || 0)
            : r.week,
        month:
          monthResp?.success && monthResp.data
            ? Number(monthResp.data.totalReservations || 0)
            : r.month,
      }));

      if (
        mealsResp &&
        mealsResp.success &&
        mealsResp.data &&
        Array.isArray(mealsResp.data.mostDemandedMeals)
      ) {
        const mapped = mealsResp.data.mostDemandedMeals.map((m) => ({
          id: m.meal?.id || m.meal?.name,
          name: m.meal?.name || "-",
          orders: Number(m.totalOrdered || m.orderCount || 0),
          image: m.meal?.imageUrl || "/api/placeholder/80/80",
        }));
        setPopularDishes(mapped);
      }

      if (
        customersResp &&
        customersResp.success &&
        customersResp.data &&
        Array.isArray(customersResp.data.customers)
      ) {
        setRecentCustomers(customersResp.data.customers);
      }

      setRefreshing(false);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError(err.message || String(err));
      setRefreshing(false);
    }
  };

  // derive recent reservations list from recentCustomers
  const recentReservationsList = React.useMemo(() => {
    const all = (recentCustomers || []).flatMap((c) => {
      const custName = c.customer?.fullName || "--";
      return (c.recentReservations || []).map((r) => ({
        ...r,
        customerName: custName,
      }));
    });

    // sort by createdAt desc (fallback to date)
    all.sort((a, b) => {
      const ta = a.createdAt || a.date || "";
      const tb = b.createdAt || b.date || "";
      return new Date(tb).getTime() - new Date(ta).getTime();
    });

    return all.slice(0, 6);
  }, [recentCustomers]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              لوحة التحكم الرئيسية
            </h1>
            <p className="text-gray-600">
              مرحبًا بك في لوحة التحكم، هنا يمكنك متابعة أداء المطعم وآخر
              الإحصائيات
            </p>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              refreshing
                ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <FaSync className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "جار التحديث..." : "تحديث البيانات"}</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            خطأ في جلب البيانات: {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaCalendarAlt}
            title="حجوزات اليوم"
            value={reservations.day}
            subtitle="مقارنة بالأمس"
            trend={reservations.trend}
            color="blue"
          />

          <StatCard
            icon={FaClock}
            title="حجوزات الأسبوع"
            value={reservations.week}
            subtitle="مقارنة بالأسبوع الماضي"
            trend={reservations.trend}
            color="green"
          />

          <StatCard
            icon={FaUsers}
            title="حجوزات الشهر"
            value={reservations.month}
            subtitle="مقارنة بالشهر الماضي"
            trend={reservations.trend}
            color="orange"
          />

          <StatCard
            icon={FaStar}
            title="متوسط التقييمات"
            value="4.8"
            subtitle="من 5 نجوم"
            trend="up"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Dishes */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FaUtensils className="text-xl text-orange-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  أكثر الأطباق طلبًا
                </h2>
              </div>
              <p className="text-gray-600 mt-1">
                الأطباق الأكثر شعبية هذا الشهر
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {popularDishes.length === 0 && (
                  <p className="text-gray-500">
                    لا توجد بيانات لأكثر الأطباق طلبًا
                  </p>
                )}
                {popularDishes.map((dish, index) => (
                  <PopularDishCard key={dish.id} dish={dish} rank={index + 1} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FaChartBar className="text-xl text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  النشاط الأخير
                </h2>
              </div>
              <p className="text-gray-600 mt-1">آخر الأنشطة والتحديثات</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentReservationsList.length === 0 && (
                  <p className="text-gray-500">لا توجد أنشطة حديثة</p>
                )}
                {recentReservationsList.map((r) => (
                  <div
                    key={r.id || `${r.customerName}-${r.date}`}
                    className={`flex items-start gap-4 p-3 rounded-lg ${
                      r.status === "completed"
                        ? "bg-green-50"
                        : r.status === "confirmed"
                        ? "bg-blue-50"
                        : r.status === "cancelled"
                        ? "bg-red-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        r.status === "completed"
                          ? "bg-green-600"
                          : r.status === "confirmed"
                          ? "bg-blue-600"
                          : r.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-gray-600"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {r.customerName} - {r.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        حجز لليوم {r.date} - عدد الأشخاص: {r.partySize}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString()
                          : r.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
