import api from './api';

// API d'authentification
const authApi = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Inscription Freelance
  registerFreelance: async (data) => {
    const response = await api.post('/auth/register/freelance', data);
    return response.data;
  },

  // Inscription Entreprise
  registerEntreprise: async (data) => {
    const response = await api.post('/auth/register/entreprise', data);
    return response.data;
  },

  // Deconnexion
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Profil utilisateur
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Mot de passe oublie
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset mot de passe
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Verifier le token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default authApi;
