import { Outlet, useNavigate } from "react-router";
import { usePharmacy } from "@/context/PharmacyContext";
import { LogOut } from "lucide-react";

export function Layout() {
  const { currentUser, logout } = usePharmacy();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-purple-50 border-r border-purple-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-purple-100 bg-purple-100/50">
          <span className="font-bold text-lg text-purple-900">PharmaManager</span>
        </div>
        <div className="flex-1" />
        {currentUser && (
          <div className="p-4 border-t border-purple-100">
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-purple-100">
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-medium">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-slate-500">
                  {currentUser.role === "director" ? "Директор" : "Поставщик"}
                </span>
              </div>
              <button onClick={() => { logout(); navigate("/login"); }} className="ml-auto p-2 text-slate-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}