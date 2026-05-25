import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/lib/api";
import { Stethoscope, User, Lock, Phone, Building2, ArrowLeft, UserPlus } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      alert("Пароли не совпадают");
      return;
    }
    try {
      await api.register({
        username: form.username,
        password: form.password,
        password2: form.password2,
        email: form.email,
        role: "supplier",
        phone: form.phone,
      });
      alert("Регистрация успешна! Теперь войдите.");
      navigate("/login");
    } catch (err) {
      alert("Ошибка регистрации: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">Регистрация поставщика</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Создайте аккаунт для работы с аптеками</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/40 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Логин</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="text" value={form.username}
                  onChange={(e) => setForm({...form, username: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="supplier4" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Название компании</label>
              <div className="mt-1 relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="text" value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="ООО НоваяФарма" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="email" value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="new@supplier.ru" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Телефон</label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="tel" value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="+7 (900) 123-45-67" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Пароль</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="password" value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Повторите пароль</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required type="password" value={form.password2}
                  onChange={(e) => setForm({...form, password2: e.target.value})}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="••••••••" />
              </div>
            </div>
            <button type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 bg-purple-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />Зарегистрироваться
            </button>
          </form>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />Вернуться ко входу
          </button>
        </div>
      </div>
    </div>
  );
}