import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  
  const loadUser = useCallback(async () => {
    if(!token){
      setLoading(false);
      return;
    }  
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get('/api/auth/user');
      if (res.data && res.data.user) {
          setUser(res.data.user);
          setIsAdmin(res.data.user.isAdmin);
          setIsAuthenticated(true);
        } else {
          throw new Error('No user data received');
        }
      } catch (err) {
        console.error('Load user error:', err);
      if (err.response && err.response.status === 404) {
        console.error('API endpoint not found. Check your server routes.');
      }
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  },[loadUser]);

  useEffect(() => {
    console.log("AuthProvider values:",{user,isAdmin,isAuthenticated,loading,error});
  }, [user,isAdmin,isAuthenticated,loading,error]);
  
  const login = async (email, password,captchaToken) => {
    setError(null); 
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password ,captcha:captchaToken});

      if(res.data.token){
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setToken(res.data.token);
        await loadUser();
        return { success: true };
      }
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

  const register = async (name, email, password,confirmationToken,captchaToken) => {
    setError(null);
    setLoading(true);
    try {
      console.log('Sending registration request...');
      const res = await axios.post('/api/users', { name, email, password,confirmationToken,captcha:captchaToken});
      console.log('Registration response:', res.data);
      localStorage.setItem('token', res.data.token);
      await loadUser();
      
      return { success: true , message: 'Registration successful. Please check your email to confirm your account.'};
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        return {
          success: false,
          message: err.response?.data?.msg || 'Registration failed. Please try again.'
        };
      } else {
        return {
          success: false,
          message: 'An unexpected error occurred. Please try again later.'
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async(email)=>{
    try{
      const res = await axios.post('/api/auth/forgot-password',{email});
      return res.data;
    }catch(err){
      throw err;
    }
  }
  const resetPassword = async (resetToken, newPassword) => {
    try {
      console.log('Attempting to reset password with token:', resetToken);
      const res = await axios.put(`/api/auth/reset-password/${resetToken}`, { password: newPassword });
      console.log('Reset password response:', res);
      return res.data;
    } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
    }
    
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    delete axios.defaults.headers.common['Authorization'];
  };


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
        logout,
        isAdmin,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;