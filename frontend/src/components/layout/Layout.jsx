import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-purple-50 border-r border-purple-100">
        <div className="p-6 font-bold text-lg text-purple-900">PharmaManager</div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}