import React, { useState ,useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from "./ForgotPassword.module.css"

const ForgotPassword = () => {
    console.log('Rendering ForgotPassword component');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await forgotPassword(email);
      setMessage(result.msg || 'Password reset email sent successfully');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage(error.response?.data?.msg || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>Forgot Password</h2>
      <p className={styles.description}>
          Enter your registered email to receive reset link.
        </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>  
        <button 
            type="submit" 
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >{isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
      </form>
      {message && (
          <p className={`${styles.message} ${
            message.includes('successfully') ? styles.success : styles.error
          }`}>
            {message}
          </p>
        )}
    </div>
    </div>
  );
};

export default ForgotPassword;