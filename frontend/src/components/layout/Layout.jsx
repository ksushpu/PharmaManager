import { NavLink, Outlet, useNavigate } from "react-router";
import { usePharmacy } from "@/context/PharmacyContext";
import { LayoutDashboard, Package, ShoppingCart, Truck, Calendar, Stethoscope, LogOut, ClipboardList } from "lucide-react";

export function Layout() {
  const { name, currentDate, setCurrentDate, currentUser, logout } = usePharmacy();
  const navigate = useNavigate();

  const navItems = [
    { name: "Дашборд", path: "/", icon: LayoutDashboard },
    { name: "Инвентарь", path: "/inventory", icon: Package },
    { name: "Закупки", path: "/purchases", icon: ShoppingCart },
    { name: "Заказы", path: "/orders", icon: ClipboardList },
    { name: "Поставщики", path: "/suppliers", icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-purple-50 border-r border-purple-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-purple-100 bg-purple-100/50">
          <Stethoscope className="w-6 h-6 text-purple-600 mr-2 shrink-0" />
          <span className="font-bold text-lg text-purple-900 truncate">{name}</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-purple-100/50 hover:text-slate-900"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-purple-100">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
            <div className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-sky-600" />
              Текущая дата
            </div>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full text-sm border-slate-200 rounded-md focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
        {currentUser && (
          <div className="p-4 border-t border-purple-100">
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-purple-100">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-medium">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-slate-500">Директор</span>
              </div>
              <button onClick={() => { logout(); navigate("/login"); }} className="ml-auto p-2 text-slate-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">Система Управления Аптекой</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}