import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
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
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}