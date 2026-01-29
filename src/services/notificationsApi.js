import api from './api.js';

const notificationsApi = {
  async getNotifications() {
    const { data } = await api.get('/notifications');
    return data;
  },

  async getUnreadCount() {
    const { data } = await api.get('/notifications/unread-count');
    return data;
  },

  async markAsRead(notificationId) {
    const { data } = await api.put(`/notifications/${notificationId}/read`);
    return data;
  },

  async markAllAsRead() {
    const { data } = await api.put('/notifications/mark-all-read');
    return data;
  },

  async create(notificationData) {
    const { data } = await api.post('/notifications', notificationData);
    return data;
  },
};

export default notificationsApi;
