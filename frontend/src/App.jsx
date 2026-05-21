import AppRoutes from "./routes.jsx"
import { PharmacyProvider } from "./context/PharmacyContext"

export default function App() {
  return (
    <PharmacyProvider>
      <AppRoutes />
    </PharmacyProvider>
  )
}