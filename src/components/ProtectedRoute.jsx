import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute({ children, requireAuth = true, userType = null, redirectTo = '/connexion' }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (userType && user) {
    const userTypeMatches = () => {
      switch (userType) {
        case 'freelance': return authService.isFreelance();
        case 'entreprise': return authService.isEntreprise();
        case 'admin': return authService.isAdmin();
        default: return true;
      }
    };
    if (!userTypeMatches()) {
      const getDashboardRoute = () => {
        if (authService.isFreelance()) return '/dashboard-freelance';
        if (authService.isEntreprise()) return '/dashboard-entreprise';
        if (authService.isAdmin()) return '/dashboard-admin';
        return '/';
      };
      return <Navigate to={getDashboardRoute()} replace />;
    }
  }

  if (isAuthenticated && user && !user.is_active) {
    authService.logout();
    return <Navigate to="/connexion" replace />;
  }

  return children;
}

export function FreelanceRoute({ children, redirectTo = '/connexion' }) {
  return <ProtectedRoute userType="freelance" redirectTo={redirectTo}>{children}</ProtectedRoute>;
}

export function EntrepriseRoute({ children, redirectTo = '/connexion' }) {
  return <ProtectedRoute userType="entreprise" redirectTo={redirectTo}>{children}</ProtectedRoute>;
}

export function AdminRoute({ children, redirectTo = '/connexion' }) {
  return <ProtectedRoute userType="admin" redirectTo={redirectTo}>{children}</ProtectedRoute>;
}

export function PublicRoute({ children, redirectTo = null }) {
  const isAuthenticated = authService.isAuthenticated();
  if (isAuthenticated) {
    const getRedirectRoute = () => {
      if (redirectTo) return redirectTo;
      if (authService.isFreelance()) return '/dashboard-freelance';
      if (authService.isEntreprise()) return '/dashboard-entreprise';
      if (authService.isAdmin()) return '/dashboard-admin';
      return '/';
    };
    return <Navigate to={getRedirectRoute()} replace />;
  }
  return children;
}

export default ProtectedRoute;
