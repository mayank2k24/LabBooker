import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/bookings">Bookings</Link></li>
        <li><Link to="/visual-booking">Visual Booking</Link></li>
        <li><Link to="/savera-school">Savera School Bookings</Link></li>
        <li><Link to="/admin">Admin Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/forgot-password">Forgot Password</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;