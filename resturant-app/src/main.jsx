import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home.jsx";
import MainLayout from "./ui/Layouts/MainLayout.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Menu from "./pages/Menu.jsx";
import Login from "./pages/Login.jsx";
import ContactUs from "./pages/Contact-Us/ContactUs.jsx";
import "leaflet/dist/leaflet.css";
import TableBooking from "./pages/Reservation/TableBooking.jsx";
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
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
