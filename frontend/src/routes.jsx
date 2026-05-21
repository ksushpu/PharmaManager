import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Purchasing } from "./pages/Purchasing";
import { DirectorOrders } from "./pages/DirectorOrders";
import { Suppliers } from "./pages/Suppliers";
import { GuestHome } from "./pages/GuestHome";
import { Login } from "./pages/Login";
import { SupplierAssortment } from "./pages/SupplierAssortment";
import { SupplierOrders } from "./pages/SupplierOrders";
import { usePharmacy } from "./context/PharmacyContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = usePharmacy();
  if (!allowedRoles.includes(currentUser?.role)) return <Navigate to="/" replace />;
  return children;
}

function RootRoute() {
  const { currentUser } = usePharmacy();
  if (!currentUser) return <GuestHome />;
  if (currentUser.role === "director") return <Dashboard />;
  if (currentUser.role === "supplier") return <SupplierAssortment />;
  return <GuestHome />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <RootRoute /> },
      { path: "inventory", element: <ProtectedRoute allowedRoles={["director"]}><Inventory /></ProtectedRoute> },
      { path: "purchases", element: <ProtectedRoute allowedRoles={["director"]}><Purchasing /></ProtectedRoute> },
      { path: "orders", element: <ProtectedRoute allowedRoles={["director"]}><DirectorOrders /></ProtectedRoute> },
      { path: "suppliers", element: <ProtectedRoute allowedRoles={["director"]}><Suppliers /></ProtectedRoute> },
      { path: "supplier-orders", element: <ProtectedRoute allowedRoles={["supplier"]}><SupplierOrders /></ProtectedRoute> },
      { path: "*", element: <div className="p-8 text-center text-xl font-bold">404</div> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}