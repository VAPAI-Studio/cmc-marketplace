import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageSpinner } from './ui';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'creator' | 'buyer' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have required role, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
