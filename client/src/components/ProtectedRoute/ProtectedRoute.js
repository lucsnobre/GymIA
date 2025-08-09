import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Preserves the intended destination for post-login redirect
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="container text-center p-xl">
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p className="text-secondary mt-md">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to login with return path if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Render protected content if authenticated
  return children;
}

export default ProtectedRoute;
