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
    path: "dashboard/overview",
    element: <Overview />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
