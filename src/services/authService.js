const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async registerFreelance(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register_freelance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, user_type: 'freelance' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
      if (data.token) this.setAuthData(data.token, data.user);
      return { success: true, message: data.message || 'Inscription reussie', user: data.user, token: data.token };
    } catch (error) {
      return { success: false, message: error.message || 'Erreur lors de l\'inscription' };
    }
  }

  async registerEntreprise(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register_entreprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, user_type: 'entreprise' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');
      if (data.token) this.setAuthData(data.token, data.user);
      return { success: true, message: data.message || 'Inscription reussie', user: data.user, token: data.token };
    } catch (error) {
      return { success: false, message: error.message || 'Erreur lors de l\'inscription' };
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la connexion');
      if (!data.user.is_active) throw new Error('Votre compte n\'est pas actif.');
      this.setAuthData(data.token, data.user);
      return { success: true, message: data.message || 'Connexion reussie', user: data.user, token: data.token };
    } catch (error) {
      return { success: false, message: error.message || 'Erreur lors de la connexion' };
    }
  }

  async getCurrentUser() {
    try {
      if (!this.token) throw new Error('Aucun token d\'authentification');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) this.logout();
        throw new Error(data.message || 'Erreur lors de la recuperation des donnees utilisateur');
      }
      if (!data.user.is_active) {
        this.logout();
        throw new Error('Votre compte n\'est plus actif.');
      }
      this.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  logout(redirectTo = '/') {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.replace(redirectTo);
  }

  isAuthenticated() { return Boolean(this.token && this.user); }
  getToken() { return this.token; }
  getUser() { return this.user; }
  isFreelance() { return this.user?.user_type === 'freelance'; }
  isEntreprise() { return this.user?.user_type === 'entreprise'; }
  isAdmin() { return this.user?.user_type === 'admin'; }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getDashboardPathFor(user = this.user) {
    const type = user?.user_type;
    if (type === 'freelance') return '/dashboard-freelance';
    if (type === 'entreprise') return '/dashboard-entreprise';
    if (type === 'admin') return '/dashboard-admin';
    return '/';
  }

  redirectToDashboard() {
    window.location.replace(this.getDashboardPathFor());
  }
}

const authService = new AuthService();
export default authService;
