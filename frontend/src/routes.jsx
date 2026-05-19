import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Purchasing } from "./pages/Purchasing";
import { DirectorOrders } from "./pages/DirectorOrders";
import { Suppliers } from "./pages/Suppliers";
import { Login } from "./pages/Login";
import { PharmacyProvider } from "./context/PharmacyContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PharmacyProvider><Login /></PharmacyProvider>,
  },
  {
    path: "/",
    element: <PharmacyProvider><Layout /></PharmacyProvider>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "purchases", element: <Purchasing /> },
      { path: "orders", element: <DirectorOrders /> },
      { path: "suppliers", element: <Suppliers /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}