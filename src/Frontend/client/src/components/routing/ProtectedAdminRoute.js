import React, { useContext } from 'react';
import { Navigate, Outlet , useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedAdminRoute = () => {
  const { user , loading, } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;