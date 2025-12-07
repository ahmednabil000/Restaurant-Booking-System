import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider ,HashRouter} from "react-router/dom";
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

const stripePromise = loadStripe(
  "pk_test_51Sb7C7IIwlX9F94VJubdxctW02SPrvJo7f5IgqOkbt2RNqN3SKmGzt1upBLA3QBCc4Z0Nac5Jca9qgrM2iybGbIb00dIiYV6qm"
); // Your publishable key

createRoot(document.getElementById("root")).render(
 <StrictMode>
    <Elements stripe={stripePromise}>
      <QueryProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="menu" element={<Menu />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route
                path="reserve"
                element={
                  <ProtectedRoute>
                    <TableBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="success-payment" element={<SuccessPayment />} />
            <Route path="cancel-payment" element={<CancelPayment />} />
            <Route path="login/success" element={<LoginSuccess />} />
            <Route path="login/error" element={<LoginError />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="checkout-form" element={<CheckoutForm />} />

            {/* Admin routes */}
            <Route
              path="dashboard"
              element={
                <AdminProtectedRoute>
                  <Overview />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="dashboard/overview"
              element={
                <AdminProtectedRoute>
                  <Overview />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="dashboard/menu-management"
              element={
                <AdminProtectedRoute>
                  <MenuManagement />
                </AdminProtectedRoute>
              }
            />
            {/* Add the rest of your admin routes similarly */}
          </Routes>
        </HashRouter>
      </QueryProvider>
    </Elements>
  </StrictMode>
);
