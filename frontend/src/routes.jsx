import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { PharmacyProvider, usePharmacy } from "./context/PharmacyContext";

function RootRoute() {
  const { currentUser } = usePharmacy();
  if (currentUser?.role === "director") return <Dashboard />;
  if (currentUser?.role === "supplier") return <div>Supplier (coming soon)</div>;
  return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PharmacyProvider><Login /></PharmacyProvider>,
  },
  {
    path: "/",
    element: <PharmacyProvider><Layout /></PharmacyProvider>,
    children: [
      { index: true, element: <RootRoute /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}