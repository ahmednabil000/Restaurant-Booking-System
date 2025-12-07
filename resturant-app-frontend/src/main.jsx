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
import EmployeesManagement from "./pages/dashboard/EmployeesManagement.jsx";
import ProfitLoss from "./pages/dashboard/ProfitLoss.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

// Import protection components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import SuccessPayment from "./pages/SuccessPayment.jsx";
import CancelPayment from "./pages/CancelPayment.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./pages/CheckoutForm.jsx";

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
    path: "success-payment",
    element: <SuccessPayment />,
  },
  {
    path: "cancel-payment",
    element: <CancelPayment />,
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
  {
    path: "checkout-form",
    element: <CheckoutForm />,
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
    path: "dashboard/employees-management",
    element: (
      <AdminProtectedRoute>
        <EmployeesManagement />
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
    path: "dashboard/profit-loss",
    element: (
      <AdminProtectedRoute>
        <ProfitLoss />
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
const stripePromise = loadStripe(
  "pk_test_51Sb7C7IIwlX9F94VJubdxctW02SPrvJo7f5IgqOkbt2RNqN3SKmGzt1upBLA3QBCc4Z0Nac5Jca9qgrM2iybGbIb00dIiYV6qm"
); // Your publishable key

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </Elements>
  </StrictMode>
);
