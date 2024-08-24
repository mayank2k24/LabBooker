import React, { createContext, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const setAlert = (msg, type, timeout = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts(prevAlerts => [...prevAlerts, { msg, type, id }]);
    setTimeout(() => removeAlert(id), timeout);
  };

  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;