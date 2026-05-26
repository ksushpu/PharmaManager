import { useState, useMemo } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, ShoppingCart, ArrowRight, Star, AlertCircle } from "lucide-react";

export function Purchasing() {
  const { products, suppliers, orders, orderProduct } = usePharmacy();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderAmount, setOrderAmount] = useState(10);
  const [selectedDosage, setSelectedDosage] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);

  useMemo(() => {
    if (selectedProduct && !selectedProduct.dosages.includes(selectedDosage)) {
      setSelectedDosage(selectedProduct.dosages[0] || "");
    }
  }, [selectedProduct, selectedDosage]);

  const getOrderCount = (supplierId) => {
    const numericId = supplierId.replace("s", "");
    return orders.filter(o => String(o.supplierId) === numericId || o.supplierId === supplierId).length;
  };

  const availableSuppliers = useMemo(() => {
    const searchName = selectedProduct?.name || searchTerm;
    if (!searchName || searchName.length < 2) return [];
    const result = [];
    suppliers.forEach((supplier) => {
      supplier.products.forEach(sp => {
        if (sp.productName.toLowerCase().includes(searchName.toLowerCase()) && sp.quantity > 0) {
          result.push({
            supplier,
            productName: sp.productName,
            dosage: sp.dosage,
            rating: supplier.rating || 3,
            availableQuantity: sp.quantity,
          });
        }
      });
    });
    if (selectedDosage) {
      return result
        .filter(r => r.dosage === selectedDosage)
        .sort((a, b) => a.rating - b.rating || getOrderCount(b.supplier.id) - getOrderCount(a.supplier.id));
    }
    return result.sort((a, b) => a.rating - b.rating || getOrderCount(b.supplier.id) - getOrderCount(a.supplier.id));
  }, [selectedProduct, searchTerm, suppliers, selectedDosage, orders]);

  const handleOrder = (supplierId, productName, dosage) => {
    if (!orderAmount || orderAmount <= 0) return;
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    const numericId = parseInt(supplierId.replace("s", ""));
    orderProduct(productName, numericId, orderAmount, dosage);
    alert(`Заказано ${orderAmount} шт. "${productName}" у ${supplier.name}`);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800">Закупка товаров</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text" placeholder="Поиск товара..."
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
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setSearchTerm("");
                    }}
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
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {selectedProduct ? selectedProduct.name : "Все поставщики"}
                </h3>
                {selectedProduct && (
                  <>
                    <p className="text-sm text-slate-500">Текущий остаток: {selectedProduct.quantity} шт.</p>
                    <button 
                      onClick={() => { setSelectedProductId(null); setSearchTerm(""); }}
                      className="text-xs text-sky-600 hover:text-sky-800 mt-1 underline"
                    >
                      ← Сбросить и искать другой товар
                    </button>
                  </>
                )}
              </div>
              {selectedProduct && (
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Дозировка</label>
                  <select
                    value={selectedDosage}
                    onChange={(e) => setSelectedDosage(e.target.value)}
                    className="text-sm border-slate-200 rounded-md"
                  >
                    <option value="">Все</option>
                    {selectedProduct.dosages.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">
                Доступные поставщики
              </h4>
              {availableSuppliers.length > 0 ? (
                <div className="space-y-4">
                  {availableSuppliers.map((item, index) => (
                    <div
                      key={`${item.supplier.id}-${item.productName}-${item.dosage}`}
                      className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm hover:border-sky-200 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h5 className="font-bold text-slate-900 mr-3">{item.supplier.name}</h5>
                          <div className="flex items-center bg-purple-100 px-2 py-0.5 rounded text-xs font-medium text-purple-800">
                            {item.rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
                          </div>
                          {index === 0 && (
                            <span className="ml-2 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                              Рекомендуемый
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {item.productName} — {item.dosage}
                        </p>
                        <p className="text-sm text-slate-500">
                          В наличии: {item.availableQuantity} шт.
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="flex items-center border rounded-md overflow-hidden bg-white">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="1" max={item.availableQuantity}
                            value={orderAmount}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setOrderAmount(val === "" ? 0 : parseInt(val));
                            }}
                            className="w-16 px-2 py-1 text-sm border-none text-center"
                          />
                          <span className="px-2 text-xs text-slate-500 bg-slate-50 border-l py-1">шт.</span>
                        </div>
                        <button
                          onClick={() => handleOrder(item.supplier.id, item.productName, item.dosage)}
                          disabled={orderAmount > item.availableQuantity || orderAmount <= 0}
                          className="flex items-center bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium text-sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Заказать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">
                    {searchTerm ? "Нет доступных предложений" : "Введите название товара для поиска"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}