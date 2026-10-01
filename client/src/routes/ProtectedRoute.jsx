import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

/**
 * Protected Route Guard
 * Enforces strict authentication for protected application workspace
 */
export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-ink-muted text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-ink-muted animate-ping" />
          <span>Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
