import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/pending-approvals');
      setPendingUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to fetch pending users. Please try again.');
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await axios.post(`/api/admin/approve-user/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      setMessage(`User approved successfully: ${response.data.user.name}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user. Please try again.');
    }
  };

  if (loading) return <div>Loading pending users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User Approval</h2>
      {message && <div>{message}</div>}
      {pendingUsers.length === 0 ? (
        <p>No pending users to approve.</p>
      ) : (
        <ul>
          {pendingUsers.map(user => (
            <li key={user._id}>
              {user.name} ({user.email})
              <button onClick={() => handleApprove(user._id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserApproval;