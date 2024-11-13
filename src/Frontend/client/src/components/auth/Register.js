import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const { name, email, confirmationToken } = formData;
  const { register } = useContext(AuthContext);
  const navigate= useNavigate();
  const [error, setError] = useState('');
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setCaptchaError('');
    setIsLoading(true);

    if(!captchaValue) {
      alert("Please complete the CAPTCHA");
      setIsLoading(false);
      return;
    }
  
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
  
    try {
      const result = await register(name, email, passwordRef.current.value,confirmationToken,{captchaValue});
      if (result.success) {
        setError('');
        alert('Registration successful. Please check your email to confirm your account.');
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally{
      setIsLoading(false);
      if(window.grecaptcha){
        window.grecaptcha.reset();
      }
      setCaptchaValue(null);
    }
  };

  return (
    <div className={styles.registerContainer}>
    <h1>Register</h1>
    {error && <p className={styles.errorMessage}>{error}</p>}
    <form onSubmit={onSubmit} className={styles.registerForm}>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
        required
        className={styles.inputField}
      />
      <input
        type="email"
        placeholder="Email Address"
        name="email"
        value={email}
        onChange={onChange}
        required
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        ref={passwordRef}
        minLength="8"
        required
        className={styles.inputField}
        />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        ref={confirmPasswordRef}
        minLength="8"
        required
        className={styles.inputField}
      />
      <ReCAPTCHA sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY} onChange={(value) => {
        setCaptchaValue(value); 
        setCaptchaError('');}
        } />
      <button type="submit" disabled={isLoading} className={styles.submitButton}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
    <p className={styles.linkText}>Already have an account? <Link to="/login">Login</Link></p>
  </div>
);
};

export default Register;