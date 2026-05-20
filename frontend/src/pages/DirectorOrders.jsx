import { usePharmacy } from "@/context/PharmacyContext";
import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

export function DirectorOrders() {
  const { orders, suppliers } = usePharmacy();

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-50 border-green-200";
      case "rejected": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 className="w-5 h-5 mr-1.5" />;
      case "rejected": return <XCircle className="w-5 h-5 mr-1.5" />;
      default: return <Clock className="w-5 h-5 mr-1.5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed": return "Подтвержден";
      case "rejected": return "Отклонен";
      default: return "Ожидает";
    }
  };

  const getSupplierName = (id) => {
    const s = suppliers.find(s => s.id === id);
    return s ? s.name : "Неизвестный поставщик";
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
        <ClipboardList className="w-6 h-6 mr-3 text-sky-600" />
        Мои заказы
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Поставщик</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Товар</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Фасовка</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Количество</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    У вас пока нет заказов.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {format(parseISO(order.createdAt), "dd.MM.yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      {getSupplierName(order.supplierId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        {order.dosage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                      {order.quantity} шт.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                        {order.status === "rejected" && order.rejectionReason && (
                          <span className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={order.rejectionReason}>
                            Причина: {order.rejectionReason}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}