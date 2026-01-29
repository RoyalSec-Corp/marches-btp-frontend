import axios from 'axios';

const API_URL = 'http://localhost:3002/api/admin';

const adminApi = {
  getStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getMapData: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/map-data`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/user-search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteUser: async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateUser: async (id, userData) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getUserActivity: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/${id}/activity`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAllUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getDisputes: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/disputes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  resolveDispute: async (id, decision) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/disputes/${id}/resolve`, { decision }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default adminApi;
