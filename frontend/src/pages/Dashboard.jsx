import { usePharmacy } from "@/context/PharmacyContext";
import { isBefore, parseISO } from "date-fns";
import { AlertCircle, Package, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function Dashboard() {
  const { products, currentDate, writeOffExpired } = usePharmacy();

  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const expiredProducts = products.filter(p => isBefore(parseISO(p.expirationDate), parseISO(currentDate)) && p.quantity > 0);
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 20);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Обзор аптеки</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Суммарная стоимость</p>
              <h3 className="text-3xl font-bold text-slate-800">{totalValue.toLocaleString()} ₽</h3>
            </div>
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Всего товаров (ед.)</p>
              <h3 className="text-3xl font-bold text-slate-800">{totalItems}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Просроченные товары</p>
              <h3 className="text-3xl font-bold text-red-600">{expiredProducts.length}</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          {expiredProducts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-red-100 flex justify-between items-center">
              <span className="text-xs font-medium text-red-700">Требуется списание</span>
              <button onClick={writeOffExpired} className="text-xs font-semibold text-red-700 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md">
                Списать всё
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Критичные остатки</h3>
            <Link to="/purchases" className="text-sm text-sky-600 hover:text-sky-700 flex items-center font-medium">
              Закупки <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">Нет товаров с критичным остатком.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map(p => (
                <li key={p.id} className="flex justify-between items-center px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">Дозировки: {p.dosages.join(", ")}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                    Остаток: {p.quantity} шт.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Просрочка к списанию</h3>
            <Link to="/inventory" className="text-sm text-sky-600 hover:text-sky-700 flex items-center font-medium">
              Инвентарь <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {expiredProducts.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">Просроченных товаров нет.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {expiredProducts.map(p => (
                <li key={p.id} className="flex justify-between items-center px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-red-500">Срок: {p.expirationDate}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-600">{p.quantity} шт.</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}