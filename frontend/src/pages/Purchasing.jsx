import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, ShoppingCart, ArrowRight } from "lucide-react";

export function Purchasing() {
  const { products } = usePharmacy();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800">Закупка товаров</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск товара..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <ul className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedProductId(p.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      selectedProductId === p.id ? "bg-sky-50 border-l-2 border-sky-500" : "border-l-2 border-transparent"
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${selectedProductId === p.id ? "text-sky-900" : "text-slate-800"}`}>{p.name}</p>
                      <p className="text-xs text-slate-500">В наличии: {p.quantity} шт.</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${selectedProductId === p.id ? "text-sky-500" : "text-slate-300"}`} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden lg:col-span-2">
          {selectedProduct ? (
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-500">Текущий остаток: {selectedProduct.quantity} шт.</p>
              <p className="text-sm text-slate-500 mt-1">Дозировки: {selectedProduct.dosages.join(", ")}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <ShoppingCart className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium text-slate-700">Выберите товар для закупки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}