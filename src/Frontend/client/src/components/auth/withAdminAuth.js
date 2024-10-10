import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, checkAuthStatus } = useContext(AuthContext);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const verifyAdmin = async () => {
        await checkAuthStatus();
        setIsChecking(false);
      };
      verifyAdmin();
    }, [checkAuthStatus]);

    if (isChecking || loading) {
      return <div>Loading...</div>;
    }

    if (!user || !user.isAdmin) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;