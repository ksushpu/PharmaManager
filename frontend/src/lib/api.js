const API_BASE = 'http://localhost:8000/api';

async function request(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pharmaUser');
    window.location.href = '/login';
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Ошибка запроса');
  }

  return response.json();
}

export const api = {
  //аптеки
  getPharmacies: () => request('/pharmacies/'),
  getPharmacy: (id) => request(`/pharmacies/${id}/`),

  //товары
  getProducts: (pharmacyId) => request(`/products/?pharmacy_id=${pharmacyId}`),
  createProduct: (data) => request('/products/', { method: 'POST', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}/`, { method: 'DELETE' }),
  writeOffExpired: (pharmacyId) => request('/products/write_off_expired/', {
    method: 'POST',
    body: JSON.stringify({ pharmacy_id: pharmacyId }),
  }),
  getTotalValue: (pharmacyId) => request(`/products/total_value/?pharmacy_id=${pharmacyId}`),

  //поставщики
  getSuppliers: () => request('/suppliers/'),
  getSupplierProducts: (supplierId) => request(`/supplier-products/?supplier_id=${supplierId}`),
  createSupplierProduct: (data) => request('/supplier-products/', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplierProduct: (id, data) => request(`/supplier-products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteSupplierProduct: (id) => request(`/supplier-products/${id}/`, { method: 'DELETE' }),

  //предпочтения
  getPreferences: () => request('/preferences/'),

  //заказы
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders/${query ? `?${query}` : ''}`);
  },
  createOrder: (data) => request('/orders/', { method: 'POST', body: JSON.stringify(data) }),
  confirmOrder: (id) => request(`/orders/${id}/confirm/`, { method: 'POST' }),
  rejectOrder: (id, reason) => request(`/orders/${id}/reject/`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  //авторизация
  login: async (username, password) => {
    const data = await request('/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (data) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
    }
    return data;
  },
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/me/'),
};