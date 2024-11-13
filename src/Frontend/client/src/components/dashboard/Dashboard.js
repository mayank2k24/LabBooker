import React, { useEffect, useState,useContext } from 'react';
import { useBookings } from '../../context/BookingContext';
import {AuthContext} from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import axios from 'axios';

const Dashboard = () => {
  const { allBookings, loading, error, fetchAllBookings } = useBookings();
  const {user} = useContext(AuthContext);
  const [setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    activeBookings:[],
    totalBookings: 0,
    upcomingBookings: 0,
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
    console.log('Bookings:', allBookings);
    if (allBookings & allBookings.length > 0) {
      const now = new Date();
      const active = allBookings.filter(booking => new Date(booking.start) <= now && new Date(booking.end) >= now);
      const upcoming = allBookings.filter(booking => new Date(booking.start) > now);
      const past = allBookings.filter(booking => new Date(booking.end) < now);
      
      const resourceCounts = allBookings.reduce((acc, booking) => {
        acc[booking.resource] = (acc[booking.resource] || 0) + 1;
        return acc;
      }, {});

      const mostBooked = Object.entries(resourceCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['N/A', 0])[0];

      setDashboardData({
        activeBookings: active,
        totalBookings: allBookings.length,
        upcomingBookings: upcoming.length,
        pastBookings: past.length,
        mostBookedResource: mostBooked
      });
    }
  }, [allBookings]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/bookings/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDashboardData(response.data);
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
          <p>{dashboardData.totalBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Upcoming Bookings</h3>
          <p>{dashboardData.upcomingBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Past Bookings</h3>
          <p>{dashboardData.pastBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Most Booked Resource</h3>
          <p>{dashboardData.mostBookedResource}</p>
        </div>
      </div>
      <div className={styles.activeBookingsSection}>
        <h2 className={styles.sectionTitle}>Active Bookings</h2>
        <div className={styles.bookingsList}>
          {dashboardData.activeBookings.length === 0 ? (
            <p className={styles.noBookings}>No active bookings at the moment</p>
          ) : (
            dashboardData.activeBookings.map(booking => (
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