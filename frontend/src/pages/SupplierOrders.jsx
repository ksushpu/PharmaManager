import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

export function SupplierOrders() {
  const { currentUser, orders, updateOrderStatus, name: pharmacyName } = usePharmacy();
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingOrderId, setRejectingOrderId] = useState(null);

  const supplierOrders = orders.filter(o => {
    const orderSupplierId = String(o.supplierId);
    const userId = currentUser?.id;
    return orderSupplierId === userId || orderSupplierId === userId?.replace("s", "");
  });

  const handleConfirm = (orderId) => {
    if (window.confirm("Подтвердить заказ?")) {
      updateOrderStatus(orderId, "confirmed");
    }
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (rejectingOrderId && rejectReason.trim()) {
      updateOrderStatus(rejectingOrderId, "rejected", rejectReason);
      setRejectingOrderId(null);
      setRejectReason("");
    }
  };

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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
        <ClipboardList className="w-6 h-6 mr-3 text-sky-600" />Заказы от аптек
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Заказчик</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Позиция</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Количество</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {supplierOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">У вас пока нет заказов.</td></tr>
              ) : (
                supplierOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-slate-50 ${order.status === 'pending' ? 'bg-sky-50/20' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {format(parseISO(order.createdAt), "dd.MM.yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{pharmacyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-800">{order.productName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Фасовка: <span className="font-medium text-purple-700">{order.dosage}</span></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{order.quantity} шт.</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}{getStatusText(order.status)}
                      </span>
                      {order.status === "rejected" && order.rejectionReason && (
                        <span className="block text-xs text-red-500 mt-1 max-w-[200px] truncate" title={order.rejectionReason}>
                          {order.rejectionReason}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {order.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleConfirm(order.id)}
                            className="flex items-center bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 mr-1" />Подтвердить
                          </button>
                          <button onClick={() => setRejectingOrderId(order.id)}
                            className="flex items-center bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <XCircle className="w-4 h-4 mr-1" />Отклонить
                          </button>
                        </div>
                      ) : <span className="text-slate-400 text-xs">Обработан</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">Отклонение заказа</h3>
            </div>
            <form onSubmit={handleReject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Причина отклонения:</label>
                <textarea required rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Нет в наличии..." className="w-full rounded-md border p-2 resize-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => { setRejectingOrderId(null); setRejectReason(""); }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-lg hover:bg-slate-50">Отмена</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm">Подтвердить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}