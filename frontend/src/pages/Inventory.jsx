import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { isBefore, parseISO } from "date-fns";
import { Search, AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";

export function Inventory() {
  const { products, currentDate, writeOffExpired, removeProduct, addProduct } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const expiredCount = products.filter(p =>
    p.quantity > 0 && isBefore(parseISO(p.expirationDate), parseISO(currentDate))
  ).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addProduct({
      id: Date.now().toString(),
      name: formData.get("name"),
      price: Number(formData.get("price")),
      dosages: formData.get("dosages").split(",").map(s => s.trim()),
      quantity: Number(formData.get("quantity")),
      expirationDate: formData.get("expirationDate"),
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Инвентарь</h2>
        <div className="flex items-center gap-3">
          {expiredCount > 0 && (
            <button onClick={writeOffExpired} className="flex items-center bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-medium text-sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Списать просрочку ({expiredCount})
            </button>
          )}
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-lg font-medium text-sm shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Наименование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Фасовки</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Цена</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Количество</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Срок годности</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filtered.map((product) => {
                const isExpired = isBefore(parseISO(product.expirationDate), parseISO(currentDate)) && product.quantity > 0;
                return (
                  <tr key={product.id} className={`hover:bg-slate-50 ${isExpired ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900">{product.name}</span>
                        {isExpired && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md">Просрочен</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.dosages.map((d, i) => (
                          <span key={i} className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-md">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{product.price} ₽</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${product.quantity === 0 ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-800'}`}>
                        {product.quantity} шт.
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1.5">
                        {isExpired ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        <span className={isExpired ? "text-red-600 font-medium" : "text-slate-600"}>{product.expirationDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => removeProduct(product.id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Удалить">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Ничего не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Новый товар</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                <input required name="name" type="text" className="w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Фасовки (через запятую)</label>
                <input required name="dosages" type="text" placeholder="5 мг, 10 мг" className="w-full rounded-md border p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Цена (₽)</label>
                  <input required name="price" type="number" min="0" className="w-full rounded-md border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Количество</label>
                  <input required name="quantity" type="number" min="0" className="w-full rounded-md border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Срок годности</label>
                <input required name="expirationDate" type="date" className="w-full rounded-md border p-2" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-lg hover:bg-slate-50">
                  Отмена
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-sm">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}