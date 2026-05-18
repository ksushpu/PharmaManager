import { createContext, useContext, useState } from "react";
import { isBefore, parseISO } from "date-fns";

const initialProducts = [
  { id: "1", name: "Аспирин", price: 120, dosages: ["500 мг"], quantity: 50, expirationDate: "2026-05-15" },
  { id: "2", name: "Ибупрофен", price: 250, dosages: ["200 мг", "400 мг"], quantity: 12, expirationDate: "2025-10-10" },
  { id: "3", name: "Парацетамол", price: 80, dosages: ["500 мг"], quantity: 100, expirationDate: "2027-01-20" },
  { id: "4", name: "Омепразол", price: 340, dosages: ["20 мг"], quantity: 5, expirationDate: "2026-04-20" },
];

const initialSuppliers = [
  { id: "s1", name: "ФармКомплект", products: [
    { productId: "1", productName: "Аспирин", dosage: "500 мг", quantity: 500 },
    { productId: "2", productName: "Ибупрофен", dosage: "200 мг", quantity: 300 },
    { productId: "2", productName: "Ибупрофен", dosage: "400 мг", quantity: 200 },
  ]},
  { id: "s2", name: "Здоровье Плюс", products: [
    { productId: "2", productName: "Ибупрофен", dosage: "400 мг", quantity: 150 },
    { productId: "3", productName: "Парацетамол", dosage: "500 мг", quantity: 1000 },
    { productId: "4", productName: "Омепразол", dosage: "20 мг", quantity: 50 },
  ]},
  { id: "s3", name: "МедикаОпт", products: [
    { productId: "1", productName: "Аспирин", dosage: "500 мг", quantity: 100 },
    { productId: "4", productName: "Омепразол", dosage: "20 мг", quantity: 800 },
  ]},
];

const initialPreferences = [
  { productId: "1", supplierId: "s1", rating: 1 },
  { productId: "1", supplierId: "s3", rating: 2 },
  { productId: "2", supplierId: "s1", rating: 1 },
  { productId: "2", supplierId: "s2", rating: 2 },
  { productId: "3", supplierId: "s2", rating: 1 },
  { productId: "4", supplierId: "s3", rating: 1 },
  { productId: "4", supplierId: "s2", rating: 2 },
];

const initialOrders = [
  { id: "o1", pharmacyId: "p1", supplierId: "s1", productId: "1", productName: "Аспирин", dosage: "500 мг", quantity: 100, status: "pending", createdAt: "2026-04-25T10:00:00Z" },
];

const PharmacyContext = createContext(undefined);

export function PharmacyProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [name] = useState("Аптека Здоровье");
  const [currentDate, setCurrentDate] = useState("2026-04-28");
  const [products, setProducts] = useState(initialProducts);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [preferences] = useState(initialPreferences);
  const [orders, setOrders] = useState(initialOrders);

  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const writeOffExpired = () => {
    setProducts(prev => prev.map(p =>
      isBefore(parseISO(p.expirationDate), parseISO(currentDate)) ? { ...p, quantity: 0 } : p
    ));
  };

  const addProduct = (product) => setProducts(prev => [...prev, product]);
  const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const orderProduct = (productId, supplierId, quantity, dosage) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newOrder = {
      id: Date.now().toString(),
      pharmacyId: "p1",
      supplierId,
      productId,
      productName: product.name,
      dosage,
      quantity,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId, status, reason) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (status === "confirmed") {
          setSuppliers(prevSuppliers => prevSuppliers.map(sup => {
            if (sup.id === o.supplierId) {
              return { ...sup, products: sup.products.map(sp =>
                sp.productId === o.productId && sp.dosage === o.dosage ? { ...sp, quantity: Math.max(0, sp.quantity - o.quantity) } : sp
              )};
            }
            return sup;
          }));
          setProducts(prevProducts => prevProducts.map(p =>
            p.id === o.productId ? { ...p, quantity: p.quantity + o.quantity } : p
          ));
        }
        return { ...o, status, rejectionReason: reason };
      }
      return o;
    }));
  };

  const addSupplierProduct = (supplierId, product) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const exists = s.products.find(p => p.productId === product.productId && p.dosage === product.dosage);
        if (exists) return s;
        return { ...s, products: [...s.products, product] };
      }
      return s;
    }));
  };

  const updateSupplierProductQuantity = (supplierId, productId, dosage, quantity) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return { ...s, products: s.products.map(sp =>
          sp.productId === productId && sp.dosage === dosage ? { ...sp, quantity } : sp
        )};
      }
      return s;
    }));
  };

  const removeSupplierProduct = (supplierId, productId, dosage) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return { ...s, products: s.products.filter(sp => !(sp.productId === productId && sp.dosage === dosage)) };
      }
      return s;
    }));
  };

  return (
    <PharmacyContext.Provider value={{
      currentUser, name, currentDate, setCurrentDate, products, suppliers, preferences, orders,
      login, logout, writeOffExpired, addProduct, removeProduct, orderProduct,
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