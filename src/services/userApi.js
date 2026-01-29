import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

const userApi = {
  getMyContracts: async (userId) => {
    const response = await axios.get(`${API_URL}/my-contracts/${userId}`);
    return response.data;
  },

  createDispute: async (data) => {
    const response = await axios.post(`${API_URL}/disputes`, data);
    return response.data;
  }
};

export default userApi;
