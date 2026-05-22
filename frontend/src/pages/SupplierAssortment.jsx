import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, Plus, Trash2, Boxes } from "lucide-react";
import { isBefore, parseISO } from "date-fns";

export function SupplierAssortment() {
  const { currentUser, suppliers, currentDate, addSupplierProduct, updateSupplierProductQuantity, removeSupplierProduct } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(0);

  const supplier = suppliers.find(s => s.id === currentUser?.id);
  if (!supplier) return <div className="p-8 text-center text-xl font-bold">Поставщик не найден</div>;

  const filtered = supplier.products.filter(p =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = (productId, dosage) => {
    updateSupplierProductQuantity(supplier.id, productId, dosage, editingQuantity);
    setEditingProductId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addSupplierProduct(supplier.id, {
      productId: `new-${Date.now()}`,
      productName: formData.get("productName"),
      dosage: formData.get("dosage"),
      quantity: Number(formData.get("quantity")),
      expiryDate: formData.get("expiryDate"),
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Boxes className="w-6 h-6 mr-3 text-sky-600" />
          Мой ассортимент
        </h2>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-lg font-medium text-sm shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Добавить позицию
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Поиск по названию..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Наименование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Фасовка</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Срок годности</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">В наличии</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filtered.map((product) => {
                const isExpired = product.expiryDate && isBefore(parseISO(product.expiryDate), parseISO(currentDate));
                return (
                  <tr key={`${product.productId}-${product.dosage}`} className={`hover:bg-slate-50 ${isExpired ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {product.productName}
                      {isExpired && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded-md">
                          Срок истёк
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 text-sm font-medium text-purple-800 bg-purple-100 rounded-md">{product.dosage}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={isExpired ? "text-red-600 font-medium" : "text-slate-600"}>
                        {product.expiryDate || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProductId === `${product.productId}-${product.dosage}` ? (
                        <div className="flex items-center space-x-2">
                          <input type="number" min="0" value={editingQuantity}
                            onChange={(e) => setEditingQuantity(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border rounded" autoFocus />
                          <button onClick={() => handleSaveEdit(product.productId, product.dosage)}
                            className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded hover:bg-sky-200 font-medium">Сохранить</button>
                          <button onClick={() => setEditingProductId(null)}
                            className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 font-medium">Отмена</button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${product.quantity === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {product.quantity} шт.
                          </span>
                          <button onClick={() => { setEditingProductId(`${product.productId}-${product.dosage}`); setEditingQuantity(product.quantity); }}
                            className="ml-3 text-xs text-sky-600 hover:text-sky-800 font-medium underline">Изменить</button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => removeSupplierProduct(supplier.id, product.productId, product.dosage)}
                        className="text-slate-400 hover:text-red-600 transition-colors" title="Удалить">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Ничего не найдено</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Новая позиция</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название товара</label>
                <input required name="productName" type="text" placeholder="Введите название" className="w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Фасовка</label>
                <input required name="dosage" type="text" placeholder="500 мг" className="w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Количество</label>
                <input required name="quantity" type="number" min="1" className="w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Срок годности</label>
                <input required name="expiryDate" type="date" min={new Date().toISOString().split('T')[0]} className="w-full rounded-md border p-2" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-lg hover:bg-slate-50">Отмена</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-sm">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}