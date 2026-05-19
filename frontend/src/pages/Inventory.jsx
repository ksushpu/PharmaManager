import { usePharmacy } from "@/context/PharmacyContext";
import { isBefore, parseISO } from "date-fns";
import { Search, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Inventory() {
  const { products, currentDate } = usePharmacy();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Инвентарь</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Наименование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Фасовки</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Цена</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Количество</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Срок годности</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {products.map((product) => {
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}