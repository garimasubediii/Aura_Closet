import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminRoute() {
  const { user, loading } = useAuthStore();

  console.log('Admin route check:', { user, loading }); // For debugging

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    console.log('Access denied. User role:', user?.role); // For debugging
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}