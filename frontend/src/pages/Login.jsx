import { useState } from "react";
import { usePharmacy } from "@/context/PharmacyContext";
import { Stethoscope, Truck, Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

export function Login() {
  const { login } = usePharmacy();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("director");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = (e) => {
  e.preventDefault();
  if (activeTab === "director") {
    login({ id: "d1", role: "director", name: "Директор аптеки" });
  } else {
    login({ id: "s1", role: "supplier", name: "ФармКомплект" });
  }
  navigate("/");
};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">PharmaManager</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Система управления аптекой</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/40 sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="flex p-1 space-x-1 bg-slate-100 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab("director")}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "director" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Stethoscope className="w-4 h-4 mr-2" />Директор аптеки
            </button>
            <button
              onClick={() => setActiveTab("supplier")}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "supplier" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Truck className="w-4 h-4 mr-2" />Поставщик
            </button>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email или логин</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder={activeTab === "director" ? "director@pharmacy.ru" : "sales@supplier.ru"}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Пароль</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                activeTab === "director" ? "bg-sky-600 hover:bg-sky-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              <LogIn className="w-4 h-4 mr-2" />Войти
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">Демо-режим: любые данные для входа.</div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => navigate("/")} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}