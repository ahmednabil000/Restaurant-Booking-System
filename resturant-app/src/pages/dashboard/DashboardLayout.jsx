import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUtensils,
  FaUsers,
  FaStar,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaHome,
  FaImage,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "الرئيسية",
      icon: FaTachometerAlt,
      path: "/dashboard",
      exact: true,
    },
    {
      title: "الحجوزات",
      icon: FaCalendarAlt,
      path: "/dashboard/reservations",
    },
    {
      title: "إدارة القائمة",
      icon: FaUtensils,
      path: "/dashboard/menu-management",
    },
    {
      title: "إدارة المحتوى",
      icon: FaImage,
      path: "/dashboard/pages",
    },
    {
      title: "أوقات العمل",
      icon: FaClock,
      path: "/dashboard/working-days",
    },
    {
      title: "الفروع",
      icon: FaMapMarkerAlt,
      path: "/dashboard/branches",
    },
    {
      title: "العملاء",
      icon: FaUsers,
      path: "/dashboard/customers",
    },
    {
      title: "التقييمات",
      icon: FaStar,
      path: "/dashboard/reviews",
    },
    {
      title: "الرسائل",
      icon: FaEnvelope,
      path: "/dashboard/messages",
    },
    {
      title: "التقارير",
      icon: FaChartBar,
      path: "/dashboard/reports",
    },
    {
      title: "الإعدادات",
      icon: FaCog,
      path: "/dashboard/settings",
    },
  ];

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col max-h-screen overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <FaUtensils className="text-white text-sm" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.path, item.exact);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg  ${
                      active
                        ? "bg-linear-to-l from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 "
                        : "text-gray-700 hover:bg-gray-50 hover:text-orange-600 "
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {active && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                    )}
                    <Icon
                      className={`text-xl transition-all duration-200 ${
                        active ? "text-white drop-shadow-sm" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium transition-all duration-200 ${
                        active ? "text-white drop-shadow-sm" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                    {active && (
                      <div className="mr-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Secondary Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <NavLink
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-orange-600 hover:shadow-md rounded-lg transition-all duration-200 hover:scale-[1.01]"
              >
                <FaHome className="text-xl text-gray-500 transition-colors duration-200" />
                <span className="font-medium transition-colors duration-200">
                  العودة للموقع
                </span>
              </NavLink>

              <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:shadow-md rounded-lg transition-all duration-200 w-full text-right hover:scale-[1.01]">
                <FaSignOutAlt className="text-xl transition-colors duration-200" />
                <span className="font-medium transition-colors duration-200">
                  تسجيل الخروج
                </span>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">إ</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">المدير</p>
                <p className="text-xs text-gray-600">admin@restaurant.com</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaBars className="text-xl" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
