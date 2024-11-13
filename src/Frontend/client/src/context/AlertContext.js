import React, { createContext, useState , useEffect, useCallback, useContext } from 'react';
import {useLocation} from 'react-router-dom';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    clearAlerts([]);
  }, [location]);

  const setAlert = (msg, type, timeout = 5000) => {
    if(msg && type){
      const id = Math.random().toString(36).substring(2, 11);
      setAlerts(prevAlerts => [...prevAlerts, { msg, type, id }]);
      setTimeout(() => removeAlert(id), timeout);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, setAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;

export const useAlert = () => useContext(AlertContext);
