import React, { useState,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from "./ResetPassword.module.css"

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword(token, password);
      setMessage(result.msg || 'Password reset successful');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>Reset Password</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          disabled={isLoading}
          required
        />
        </div>
        <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          minLength={8}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          disabled={isLoading}
          required
        />
        </div>
        <button 
            type="submit" 
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
      </form>
      {message && (
          <p className={`${styles.message} ${
            message?.includes('successful') ? styles.success : styles.error
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;