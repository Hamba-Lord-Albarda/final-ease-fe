import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

interface Props {
  allowedRoles: string[];
  children: React.ReactElement;
}

export const RoleGuard: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="main-area">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
