import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated,isAdmin, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li><Link to="/bookings">Bookings</Link></li>
      {isAuthenticated && isAdmin && (<li><Link to="/admin">Admin Dashboard</Link></li>)}
      <li><a onClick={onLogout} href="#!">Logout</a></li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </>
  );

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to="/">LabBooker</Link>
      </h1>
      <ul>
        {isAuthenticated ? authLinks : guestLinks}
      </ul>
    </nav>
  );
};

export default Navbar;