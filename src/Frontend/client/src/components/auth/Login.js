import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      // First, try to use the login function from AuthContext
      const result = await login(email, password);
      if (result.success) {
        navigate('/bookings');
      } else {
        setError(result.message);
      }
    

      // If AuthContext login fails, try direct API call
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const body = JSON.stringify({ email, password });
      const res = await axios.post('/api/auth/login', body, config);
      
      console.log('Login response:', res.data);
      
      if (res.data.token) {
        // Save the token to localStorage
        localStorage.setItem('token', res.data.token);
        // Redirect to bookings page
        navigate('/bookings');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err.response.data);
      console.error('Login error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Login failed: ${err.response.data.msg || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Login failed: No response from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Login failed: ${err.message}`);
      }
    }

  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;