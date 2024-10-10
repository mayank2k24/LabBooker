import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalBookings: 0,
    activeConflicts: 0
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (!loading && user && user.isAdmin) {
      fetchAdminStats();
      fetchUsers();
      fetchBookings();
    }
  }, [user, loading]);

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setAlert('Failed to fetch admin statistics', 'danger');
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
    </div>
  );
};

export default AdminDashboard;