import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCaptchaError('');
    setIsLoading(true);

    if (!captchaValue) {
      setCaptchaError('Please complete the CAPTCHA verification');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password, captchaValue);
      if (result.success) {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || 'Invalid email or password. Please try again.');
        if(window.grecaptcha){
          window.grecaptcha.reset();
        }
          setCaptchaValue(null);
        }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Login</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={onSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
          <button 
            type="button" 
            onClick={togglePasswordVisibility}
            className={styles.togglePassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className={styles.recaptchaContainer}>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
            onChange={(value) => {
              setCaptchaValue(value);
              setCaptchaError('');
            }}
          />
          {captchaError && <p className={styles.errorMessage}>{captchaError}</p>}
        </div>
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className={styles.linkText}>Don't have an account? <Link to="/register" className={styles.link}>Register</Link></p>
      <p className={styles.linkText}><Link to="/forgot-password" className={styles.link}>Forgot Password?</Link></p>  
    </div>
  );
};

export default Login;