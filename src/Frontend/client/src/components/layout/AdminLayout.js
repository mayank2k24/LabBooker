import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css'; 

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <nav className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/conflicts" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }>
              Conflict Resolution
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/user-approval"
            className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
            }>
              User Approval
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className={styles.content}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;