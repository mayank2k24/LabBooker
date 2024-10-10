import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';

const Alert = () => {
  const { alerts, clearAlerts } = useContext(AlertContext);
  const location = useLocation();

  useEffect(() => {
    clearAlerts();
  }, [location, clearAlerts]);

  return (
    <div className="alert-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  );
};

export default Alert;