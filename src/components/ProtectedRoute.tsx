import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../data/types';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>);

  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location
        }}
        replace />);


  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if they don't have access
    return (
      <Navigate to={user.role === 'coach' ? '/coach' : '/player'} replace />);

  }
  return <>{children}</>;
};