import { useState, useMemo } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, ShoppingCart, ArrowRight, Star, AlertCircle } from "lucide-react";

export function Purchasing() {
  const { products, suppliers, preferences, orderProduct } = usePharmacy();
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

  const availableSuppliers = useMemo(() => {
    if (!selectedProduct) return [];
    const result = [];
    suppliers.forEach((supplier) => {
      const sp = supplier.products.find(
        p => p.productId === selectedProduct.id && p.dosage === selectedDosage
      );
      if (sp && sp.quantity > 0) {
        const pref = preferences.find(
          p => p.productId === selectedProduct.id && p.supplierId === supplier.id
        );
        result.push({
          supplier,
          rating: pref ? pref.rating : 3,
          availableQuantity: sp.quantity,
        });
      }
    });
    return result.sort((a, b) => a.rating - b.rating);
  }, [selectedProduct, suppliers, preferences, selectedDosage]);

  const handleOrder = (supplierId) => {
    if (!selectedProduct || orderAmount <= 0) return;
    const supplier = availableSuppliers.find(s => s.supplier.id === supplierId);
    if (supplier && supplier.availableQuantity >= orderAmount) {
      orderProduct(selectedProduct.id, supplierId, orderAmount, selectedDosage);
      alert(`Заказано ${orderAmount} шт. у ${supplier.supplier.name}`);
    } else {
      alert("Недостаточно товара у поставщика");
    }
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
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedProduct.name}</h3>
                  <p className="text-sm text-slate-500">Текущий остаток: {selectedProduct.quantity} шт.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Дозировка</label>
                  <select
                    value={selectedDosage}
                    onChange={(e) => setSelectedDosage(e.target.value)}
                    className="text-sm border-slate-200 rounded-md"
                  >
                    {selectedProduct.dosages.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">
                  Доступные поставщики
                </h4>
                {availableSuppliers.length > 0 ? (
                  <div className="space-y-4">
                    {availableSuppliers.map((item, index) => (
                      <div
                        key={item.supplier.id}
                        className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm hover:border-sky-200 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h5 className="font-bold text-slate-900 mr-3">{item.supplier.name}</h5>
                            <div className="flex items-center bg-purple-100 px-2 py-0.5 rounded text-xs font-medium text-purple-800">
                              Рейтинг: {item.rating}
                              {[...Array(3 - item.rating + 1)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 ml-0.5 fill-current" />
                              ))}
                            </div>
                            {index === 0 && (
                              <span className="ml-2 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                                Рекомендуемый
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            В наличии: {item.availableQuantity} шт.
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="flex items-center border rounded-md overflow-hidden bg-white">
                            <input
                              type="number" min="1" max={item.availableQuantity}
                              value={orderAmount}
                              onChange={(e) => setOrderAmount(parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-sm border-none text-center"
                            />
                            <span className="px-2 text-xs text-slate-500 bg-slate-50 border-l py-1">шт.</span>
                          </div>
                          <button
                            onClick={() => handleOrder(item.supplier.id)}
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
                    <p className="text-slate-600 font-medium">Нет доступных предложений</p>
                  </div>
                )}
              </div>
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