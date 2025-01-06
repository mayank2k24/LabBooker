import React, { useEffect, useState,useContext } from 'react';
import { useBookings } from '../../context/BookingContext';
import {AuthContext} from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import Whiteboard from '../utils/Whiteboard';
import axios from 'axios';

const Dashboard = () => {
  const { allBookings, loading, error, fetchAllBookings } = useBookings();
  const {user} = useContext(AuthContext);
  const [setError] = useState(null);
  const [stats, setStats] = useState({
    allBookings:[],
    activeBookings:[],
    totalBookings: 0,
    upcomingBookings: [],
    pastBookings: 0,
    mostBookedResource: 'N/A'
  });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAllBookings();
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/bookings/stats');
        if (response.data) {
          setStats(prevStats => ({
            ...prevStats,
            ...response.data
          }));
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to fetch stats');
      }
    };
  
    if (allBookings?.length > 0) {
      const now = new Date();
      const active = allBookings.filter(booking => 
        new Date(booking.start) <= now && new Date(booking.end) >= now
      );
      setStats(prevStats => ({
        ...prevStats,
        activeBookings: active,
        totalBookings: allBookings.length
      }));
    }
  
    fetchStats();
  }, [allBookings]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/bookings/stats');
        setStats(response.data || {
          allBookings: Array.isArray(response.data.allBookings) ? response.data.allBookings : [],
          activeBookings: Array.isArray(response.data.activeBookings) ? response.data.activeBookings : [],
          upcomingBookings: Array.isArray(response.data.upcomingBookings) ? response.data.upcomingBookings : []
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard data... Please wait</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>Welcome back, {user?.name}! 👋</h1>
        <p className={styles.subtitle}>Here's your booking overview</p>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Upcoming Bookings</h3>
          <p>{stats.upcomingBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Past Bookings</h3>
          <p>{stats.pastBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Most Booked Resource</h3>
          <p>{stats.mostBookedResource}</p>
        </div>
      </div>
      <div className={styles.activeBookingsSection}>
        <h2 className={styles.sectionTitle}>Active Bookings</h2>
        <div className={styles.bookingsList}>
          {stats.activeBookings.length === 0 ? (
            <p className={styles.noBookings}>No active bookings at the moment</p>
          ) : (
            stats.activeBookings.map(booking => (
              <div key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingInfo}>
                  <h3>Resource: {booking.resourceId}</h3>
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
        <div className={styles.whiteboardSection}>
          <Whiteboard />
        </div>
      </div>
    </div>
  );
}

  const formatTimeRemaining = (endTime) => {
    const remaining = new Date(endTime) - new Date();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  export default Dashboard;