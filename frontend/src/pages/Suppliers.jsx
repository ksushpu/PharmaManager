import { useState, useMemo } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, Building2, Package, Hash } from "lucide-react";

export function Suppliers() {
  const { suppliers, products } = usePharmacy();
  const [searchProductName, setSearchProductName] = useState("");
  const [searchDosage, setSearchDosage] = useState("");

  const filteredSuppliers = useMemo(() => {
    return suppliers
      .map((supplier) => {
        const supplierProductsFull = supplier.products.map((sp) => {
          const productInfo = products.find((p) => p.id === sp.productId);
          return {
            ...sp,
            productName: productInfo?.name || "Неизвестный товар",
          };
        });

        const matchedProducts = supplierProductsFull.filter((sp) => {
          const matchesName =
            searchProductName === "" ||
            sp.productName.toLowerCase().includes(searchProductName.toLowerCase());
          const matchesDosage =
            searchDosage === "" ||
            sp.dosage.toLowerCase().includes(searchDosage.toLowerCase());
          return matchesName && matchesDosage;
        });

        return { ...supplier, matchedProducts };
      })
      .filter((s) => s.matchedProducts.length > 0);
  }, [suppliers, products, searchProductName, searchDosage]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Справочник поставщиков</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по названию товара..."
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по дозировке (например: 500 мг)..."
              value={searchDosage}
              onChange={(e) => setSearchDosage(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-sky-200 transition-colors"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-800">{supplier.name}</h3>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {supplier.matchedProducts.length} поз.
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {supplier.matchedProducts.length > 0 ? (
                supplier.matchedProducts.map((sp, idx) => (
                  <div
                    key={`${sp.productId}-${sp.dosage}-${idx}`}
                    className="px-6 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 mb-0.5 flex items-center">
                          <Package className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                          {sp.productName}
                        </p>
                        <p className="text-xs text-slate-500">Дозировка: {sp.dosage}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-medium">
                        В наличии: {sp.quantity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-6 text-sm text-slate-500 text-center">
                  Нет товаров, удовлетворяющих поиску.
                </p>
              )}
            </div>
          </div>
        ))}
        {filteredSuppliers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Ни один поставщик не найден по заданным критериям.
          </div>
        )}
      </div>
    </div>
  );
}