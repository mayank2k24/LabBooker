import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeBookings: [],
    totalUsers: 0,
    pendingUsers: 0,
    totalBookings: 0,
    activeConflicts: 0
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [error, setError] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user && user.isAdmin) {
      fetchAdminStats();
      fetchUsers();
      fetchBookings();
    }
  }, [user, loading]);

  const fetchAdminStats = async () => {
    try {
      loading(true);
      const response = await axios.get('/api/bookings/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert('Failed to fetch users', 'danger');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/admin/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAlert('Failed to fetch bookings', 'danger');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <div>Access Denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h2>Admin Dashboard</h2>
      <h3>Welcome! {user.name}</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Users</h3>
          <p>{stats.pendingUsers}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Active Conflicts</h3>
          <p>{stats.activeConflicts}</p>
        </div>
      </div>
      <div className={styles.activeBookingsSection}>
        <h2 className={styles.sectionTitle}>Current Active Bookings</h2>
        <div className={styles.bookingsList}>
          {stats.activeBookings.length === 0 ? (
            <p className={styles.noBookings}>No active bookings at the moment</p>
          ) : (
            stats.activeBookings.map(booking => (
              <div key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingInfo}>
                  <h3>Resource: {booking.resourceId}</h3>
                  <p>User: {booking.user.name}</p>
                  <p>Started: {new Date(booking.start).toLocaleTimeString()}</p>
                  <p>Ends: {new Date(booking.end).toLocaleTimeString()}</p>
                </div>
                <div className={styles.timeRemaining}>
                  <p>Time Remaining: {formatTimeRemaining(booking.end)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const formatTimeRemaining = (endTime) => {
  const remaining = new Date(endTime) - new Date();
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export default AdminDashboard;