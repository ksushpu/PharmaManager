import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PharmacyProvider, usePharmacy } from "./context/PharmacyContext";

function RootRoute() {
  const { currentUser } = usePharmacy();
  if (currentUser?.role === "director") return <Dashboard />;
  return <div>Guest Home (coming soon)</div>;
}

const router = createBrowserRouter([
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