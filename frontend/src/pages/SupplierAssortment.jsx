import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Search, Plus, Trash2, Boxes } from "lucide-react";

export function SupplierAssortment() {
  const { currentUser, suppliers, removeSupplierProduct, updateSupplierProductQuantity } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Boxes className="w-6 h-6 mr-3 text-sky-600" />
          Мой ассортимент
        </h2>
        <button className="flex items-center bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-lg font-medium text-sm shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Добавить позицию
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text" placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Наименование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Фасовка</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">В наличии</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filtered.map((product) => (
                <tr key={`${product.productId}-${product.dosage}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 text-sm font-medium text-purple-800 bg-purple-100 rounded-md">
                      {product.dosage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingProductId === `${product.productId}-${product.dosage}` ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number" min="0" value={editingQuantity}
                          onChange={(e) => setEditingQuantity(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border rounded" autoFocus
                        />
                        <button onClick={() => handleSaveEdit(product.productId, product.dosage)}
                          className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded hover:bg-sky-200 font-medium">
                          Сохранить
                        </button>
                        <button onClick={() => setEditingProductId(null)}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 font-medium">
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${product.quantity === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {product.quantity} шт.
                        </span>
                        <button
                          onClick={() => {
                            setEditingProductId(`${product.productId}-${product.dosage}`);
                            setEditingQuantity(product.quantity);
                          }}
                          className="ml-3 text-xs text-sky-600 hover:text-sky-800 font-medium underline"
                        >
                          Изменить
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => removeSupplierProduct(supplier.id, product.productId, product.dosage)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Ничего не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}