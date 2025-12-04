import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home.jsx";
import MainLayout from "./ui/Layouts/MainLayout.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Menu from "./pages/Menu.jsx";
import Login from "./pages/Login.jsx";
import LoginSuccess from "./pages/LoginSuccess.jsx";
import LoginError from "./pages/LoginError.jsx";
import ContactUs from "./pages/Contact-Us/ContactUs.jsx";
import Cart from "./pages/Cart.jsx";
import QueryProvider from "./providers/QueryProvider.jsx";
import "leaflet/dist/leaflet.css";
import TableBooking from "./pages/Reservation/TableBooking.jsx";
import Overview from "./pages/dashboard/Overview.jsx";
import MenuManagement from "./pages/dashboard/MenuManagement.jsx";
import ReservationsManagement from "./pages/dashboard/ReservationsManagement.jsx";
import WorkingDaysManagement from "./pages/dashboard/WorkingDaysManagement.jsx";
import BranchesManagement from "./pages/dashboard/BranchesManagement.jsx";
import Customers from "./pages/dashboard/Customers.jsx";
import Reviews from "./pages/dashboard/Reviews.jsx";
import Messages from "./pages/dashboard/Messages.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import RestaurantManagement from "./pages/dashboard/RestaurantManagement.jsx";
import UsersManagement from "./pages/dashboard/UsersManagement.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

// Import protection components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "menu", element: <Menu /> },
      { path: "contact-us", element: <ContactUs /> },
      {
        path: "reserve",
        element: (
          <ProtectedRoute>
            <TableBooking />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "login/success",
    element: <LoginSuccess />,
  },
  {
    path: "login/error",
    element: <LoginError />,
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
  // Admin-protected dashboard routes
  {
    path: "dashboard",
    element: (
      <AdminProtectedRoute>
        <Overview />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/overview",
    element: (
      <AdminProtectedRoute>
        <Overview />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/menu-management",
    element: (
      <AdminProtectedRoute>
        <MenuManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/working-days",
    element: (
      <AdminProtectedRoute>
        <WorkingDaysManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/restaurant-management",
    element: (
      <AdminProtectedRoute>
        <RestaurantManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/branches",
    element: (
      <AdminProtectedRoute>
        <BranchesManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/reservations",
    element: (
      <AdminProtectedRoute>
        <ReservationsManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/customers",
    element: (
      <AdminProtectedRoute>
        <Customers />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/users-management",
    element: (
      <AdminProtectedRoute>
        <UsersManagement />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/reviews",
    element: (
      <AdminProtectedRoute>
        <Reviews />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/messages",
    element: (
      <AdminProtectedRoute>
        <Messages />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/reports",
    element: (
      <AdminProtectedRoute>
        <Reports />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "dashboard/settings",
    element: (
      <AdminProtectedRoute>
        <Settings />
      </AdminProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
