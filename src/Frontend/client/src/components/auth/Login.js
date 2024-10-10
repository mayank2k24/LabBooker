import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL || 'http://localhost:5000';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const { login, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err.response.data);
      console.error('Login error:', err);
      if (err.response) {
        setError(`Login failed: ${err.response.data.msg || err.response.statusText}`);
      } else if (err.request) {
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
            required
          />
        </div>
        <input type="submit" value="Login" />
      </form>
      <Link to="/forgot-password">Forgot Password?</Link>
    </div>
  );
};

export default Login;