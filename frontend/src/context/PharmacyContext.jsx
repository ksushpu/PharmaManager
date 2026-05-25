import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const PharmacyContext = createContext(undefined);

export function PharmacyProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("pharmaUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [name] = useState("Аптека Здоровье");
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
  });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pharmacyId] = useState(1);
  const [backendAvailable, setBackendAvailable] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [productsData, suppliersData, allSupplierProducts, preferencesData, ordersData] = await Promise.all([
        api.getProducts(pharmacyId),
        api.getSuppliers(),
        api.getSupplierProducts(),
        api.getPreferences(),
        api.getOrders(),
      ]);
      setProducts(productsData.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: Number(p.price),
        dosages: p.dosages ? p.dosages.map(d => typeof d === 'string' ? d : d.dosage) : [],
        quantity: p.quantity,
        expirationDate: p.expiry_date,
      })));
      setSuppliers(suppliersData.map(s => ({
        id: "s" + s.id,
        name: s.name,
        rating: s.rating,
        products: allSupplierProducts
          .filter(sp => Number(sp.supplier) === Number(s.id))
          .map(sp => ({
            productId: sp.id.toString(),
            productName: sp.product_name,
            dosage: sp.dosage,
            quantity: sp.supplier_quantity,
            expiryDate: sp.expiry_date || null,
          })),
      })));
      setPreferences(preferencesData.map(p => ({
        id: p.id,
        productId: p.product.toString(),
        supplierId: p.supplier.toString(),
        rating: p.rating,
      })));
      setOrders(ordersData.map(o => ({
        id: o.id.toString(),
        pharmacyId: o.pharmacy.toString(),
        supplierId: o.supplier.toString(),
        productId: "",
        productName: o.product_name,
        dosage: o.dosage,
        quantity: o.quantity,
        status: o.status,
        rejectionReason: o.rejection_reason,
        createdAt: o.created_at,
      })));
      setBackendAvailable(true);
    } catch (e) {
      console.log("Бэкенд недоступен");
      setBackendAvailable(false);
    }
  }, [pharmacyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("pharmaUser", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("pharmaUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const writeOffExpired = async () => {
    await api.writeOffExpired(pharmacyId);
    await loadData();
  };

  const addProduct = async (product) => {
    await api.createProduct({
      pharmacy: pharmacyId,
      name: product.name,
      price: product.price,
      dosages: product.dosages.map(d => ({ dosage: d })),
      quantity: product.quantity,
      expiry_date: product.expirationDate,
    });
    await loadData();
  };

  const updateProduct = async (id, data) => {
    await api.updateProduct(id, data);
    await loadData();
  };

  const removeProduct = async (id) => {
    await api.deleteProduct(id);
    await loadData();
  };

  const orderProduct = async (productId, supplierId, quantity, dosage) => {
    const product = products.find(p => p.id === productId) || products.find(p => p.name === productId);
    const productName = product?.name || productId;
    const numericSupplierId = typeof supplierId === 'string' ? parseInt(supplierId.replace("s", "")) : supplierId;

    await api.createOrder({
      pharmacy: pharmacyId,
      supplier: numericSupplierId,
      product_name: productName,
      dosage,
      quantity,
    });
    await loadData();
  };

  const updateOrderStatus = async (orderId, status, reason) => {
    if (status === "confirmed") {
      await api.confirmOrder(orderId);
    } else {
      await api.rejectOrder(orderId, reason);
    }
    await loadData();
  };

  const addSupplierProduct = async (supplierId, product) => {
    const numericSupplierId = typeof supplierId === 'string' ? parseInt(supplierId.replace("s", "")) : supplierId;
    await api.createSupplierProduct({
      supplier: numericSupplierId,
      product_name: product.productName,
      dosage: product.dosage,
      supplier_quantity: product.quantity,
      price: "100.00",
      expiry_date: product.expiryDate,
    });
    await loadData();
  };

  const updateSupplierProductQuantity = async (supplierId, productId, dosage, quantity) => {
    await api.updateSupplierProduct(productId, { supplier_quantity: quantity });
    await loadData();
  };

  const removeSupplierProduct = async (supplierId, productId, dosage) => {
    await api.deleteSupplierProduct(productId);
    await loadData();
  };

  if (backendAvailable === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-xl font-bold text-slate-800 mb-2">Бэкенд недоступен</p>
          <p className="text-slate-500">Запустите сервер: python manage.py runserver</p>
        </div>
      </div>
    );
  }

  return (
    <PharmacyContext.Provider value={{
      currentUser, name, currentDate, setCurrentDate, products, suppliers, preferences, orders,
      login, logout, writeOffExpired, addProduct, updateProduct, removeProduct, orderProduct,
      updateOrderStatus, addSupplierProduct, updateSupplierProductQuantity, removeSupplierProduct,
    }}>
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacy() {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error("usePharmacy must be used within a PharmacyProvider");
  return context;
}