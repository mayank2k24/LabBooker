import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.baseURL = 'http://localhost:5000'; // or your API's base URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    try {
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get('/api/auth');
        if (res.data) {
          setUser(res.data);
          setToken(token);
          setIsAuthenticated(true);
        } else {
          throw new Error('No user data received');
        }
      }
    } catch (err) {
      console.error('Load user error:', err);
      if (err.response && err.response.status === 404) {
        console.error('API endpoint not found. Check your server routes.');
      }
      logout(); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null); 
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        return { success: false, message: err.response.data.msg || 'Login failed' };
      } else if (err.request) {
        return { success: false, message: 'No response from server. Please try again.' };
      } else {
        return { success: false, message: err.message || 'An unexpected error occurred' };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/api/users', { name, email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        message: err.response?.data?.msg || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['x-auth-token'];
    // Optionally, you could also make an API call to invalidate the token on the server
  };

  console.log('AuthProvider values:', { user, isAuthenticated, loading, error });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;