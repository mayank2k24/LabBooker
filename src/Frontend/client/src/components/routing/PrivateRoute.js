import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; //(spinner TODO)
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }


  return <Outlet />;
};

export default PrivateRoute;