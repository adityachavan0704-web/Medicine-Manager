import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

// Medicine API
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
  getExpiring: () => api.get('/medicines/expiring'),
  search: (query) => api.get(`/medicines/search?q=${query}`),
  dispense: (id, data) => api.post(`/medicines/${id}/dispense`, data),
};

// Alert API
export const alertAPI = {
  getAll: () => api.get('/alerts'),
  getUnread: () => api.get('/alerts/unread'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  acknowledge: (id) => api.put(`/alerts/${id}/acknowledge`),
  delete: (id) => api.delete(`/alerts/${id}`),
  generate: () => api.post('/alerts/generate'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTrends: () => api.get('/analytics/trends'),
};

// Data Structure Visualization API
export const dsAPI = {
  getMinHeap: () => api.get('/ds/minheap'),
  getHashMap: () => api.get('/ds/hashmap'),
  getQueue: () => api.get('/ds/queue'),
  getLinkedList: () => api.get('/ds/linkedlist'),
};

export default api;
