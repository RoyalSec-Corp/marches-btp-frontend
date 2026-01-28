import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_CONTRACTS_API || 'http://localhost:3002';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Intercepteur: Token & Cache
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Cache-buster
  if ((config.method || '').toLowerCase() === 'get') {
    config.params = { ...(config.params || {}), _ts: Date.now() };
  }

  return config;
});

// Notifications
export const getNotifications = () => api.get('/notifications');
export const getUnreadNotificationsCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.put('/notifications/mark-all-read');

// Appel d'offres
export const createCallForTenders = (data) => api.post('/calls-for-tenders', data);
export const listCallsForTenders = () => api.get('/calls-for-tenders');
export const applyToCallForTenders = (id, data) => api.post(`/calls-for-tenders/${id}/apply`, data);
export const listApplicationsForCallForTenders = (id) => api.get(`/calls-for-tenders/${id}/applications`);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');

export default api;
