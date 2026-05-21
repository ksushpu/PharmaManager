import { usePharmacy } from "@/context/PharmacyContext";
import { Package, Search, Stethoscope, Clock } from "lucide-react";
import { useState } from "react";

export function GuestHome() {
  const { products, name } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl shadow-md p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <Stethoscope className="w-8 h-8 mr-3 opacity-80" />
            Добро пожаловать в {name}
          </h2>
          <p className="text-sky-100 max-w-xl">Ознакомьтесь с доступным ассортиментом нашей аптеки.</p>
        </div>
        <div className="flex items-center bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30">
          <Clock className="w-6 h-6 mr-3 text-white" />
          <div>
            <p className="text-sm font-medium text-sky-50">Режим работы</p>
            <p className="font-bold">Круглосуточно 24/7</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800">Каталог товаров</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск препаратов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.quantity > 0 ? 'В наличии' : 'Нет'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h4>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>Дозировки: <span className="font-medium">{product.dosages.join(", ")}</span></p>
                <p>Остаток: <span className="font-medium">{product.quantity} шт.</span></p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">Ничего не найдено.</div>
          )}
        </div>
      </div>
    </div>
  );
}