import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

export function setAccessToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

function unwrap(response) {
  return response.data;
}

export const authApi = {
  login: (payload) => apiClient.post('/auth/login', payload).then(unwrap),
  register: (payload) => apiClient.post('/auth/register', payload).then(unwrap),
};

export const productApi = {
  getAll: () => apiClient.get('/products').then(unwrap),
  create: (payload) => apiClient.post('/products', payload).then(unwrap),
  update: (id, payload) => apiClient.put(`/products/${id}`, payload).then(unwrap),
  remove: (id) => apiClient.delete(`/products/${id}`).then(unwrap),
};

export const stockApi = {
  stockIn: (payload) => apiClient.post('/stock/in', payload).then(unwrap),
  stockOut: (payload) => apiClient.post('/stock/out', payload).then(unwrap),
};

export const userApi = {
  getAll: () => apiClient.get('/users').then(unwrap),
};

export default apiClient;

