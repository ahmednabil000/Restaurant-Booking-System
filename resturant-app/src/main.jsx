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
import PagesManagement from "./pages/dashboard/PagesManagement.jsx";
import WorkingDaysManagement from "./pages/dashboard/WorkingDaysManagement.jsx";
import BranchesManagement from "./pages/dashboard/BranchesManagement.jsx";
import Customers from "./pages/dashboard/Customers.jsx";
import Reviews from "./pages/dashboard/Reviews.jsx";
import Messages from "./pages/dashboard/Messages.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "menu", element: <Menu /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "reserve", element: <TableBooking /> },
      { path: "cart", element: <Cart /> },
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
    path: "dashboard",
    element: <Overview />,
  },
  {
    path: "dashboard/overview",
    element: <Overview />,
  },
  {
    path: "dashboard/menu-management",
    element: <MenuManagement />,
  },
  {
    path: "dashboard/pages",
    element: <PagesManagement />,
  },
  {
    path: "dashboard/working-days",
    element: <WorkingDaysManagement />,
  },
  {
    path: "dashboard/branches",
    element: <BranchesManagement />,
  },
  {
    path: "dashboard/reservations",
    element: <ReservationsManagement />,
  },
  {
    path: "dashboard/customers",
    element: <Customers />,
  },
  {
    path: "dashboard/reviews",
    element: <Reviews />,
  },
  {
    path: "dashboard/messages",
    element: <Messages />,
  },
  {
    path: "dashboard/reports",
    element: <Reports />,
  },
  {
    path: "dashboard/settings",
    element: <Settings />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
