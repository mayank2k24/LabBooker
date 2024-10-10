import React, { useState ,useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    console.log('Rendering ForgotPassword component');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting forgot password request for email:', email);
      const result = await forgotPassword(email);
      console.log('Forgot password result:', result);
      setMessage(result.msg || 'Password reset email sent successfully');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;