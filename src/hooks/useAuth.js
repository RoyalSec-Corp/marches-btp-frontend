import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        setLoading(true);
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const registerFreelance = async (userData) => {
    setLoading(true);
    setError(null);
    const result = await authService.registerFreelance(userData);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    } else {
      setError(result.message);
    }
    setLoading(false);
    return result;
  };

  const registerEntreprise = async (userData) => {
    setLoading(true);
    setError(null);
    const result = await authService.registerEntreprise(userData);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    } else {
      setError(result.message);
    }
    setLoading(false);
    return result;
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    const result = await authService.login(credentials);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    } else {
      setError(result.message);
    }
    setLoading(false);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const refreshUser = async () => {
    setLoading(true);
    const result = await authService.getCurrentUser();
    if (result.success) {
      setUser(result.user);
    } else {
      setError(result.message);
      if (!result.success && result.message.includes('actif')) {
        logout();
      }
    }
    setLoading(false);
    return result;
  };

  const isAuthenticated = () => authService.isAuthenticated();
  const isFreelance = () => authService.isFreelance();
  const isEntreprise = () => authService.isEntreprise();
  const isAdmin = () => authService.isAdmin();
  const clearError = () => setError(null);

  const value = {
    user, token, loading, error,
    registerFreelance, registerEntreprise, login, logout,
    refreshUser, isAuthenticated, isFreelance, isEntreprise, isAdmin, clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return context;
}

export default useAuth;
