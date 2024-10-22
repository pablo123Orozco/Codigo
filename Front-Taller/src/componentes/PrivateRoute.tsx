import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('token'); // Verificar si el token está presente

  // Si el token no está presente, redirigir al login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
