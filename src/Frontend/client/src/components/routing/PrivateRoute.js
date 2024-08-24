import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);
  console.log('AuthContext in PrivateRoute:', authContext);

  if (!authContext) {
    console.error('AuthContext is undefined in PrivateRoute');
    return <Navigate to="/login" />;
  }

  const { isAuthenticated, loading } = authContext;

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;