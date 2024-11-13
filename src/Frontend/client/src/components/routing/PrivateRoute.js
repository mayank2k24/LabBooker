import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation , useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, loading, location, navigate]);

 if (loading) {
    return <div>Loading...</div>; //(spinner TODO)
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default PrivateRoute;