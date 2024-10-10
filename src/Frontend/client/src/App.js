
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Bookings from './components/bookings/Bookings';
import PrivateRoute from './components/routing/PrivateRoute';
import ProtectedAdminRoute from './components/routing/ProtectedAdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ConflictResolution from './components/bookings/ConflictResolution';
import UserApproval from './components/dashboard/UserApproval';
import './App.css';

function App() {
  return (
    <AuthProvider>
        <Router>
      <AlertProvider>
          <div className="App">
            <Navbar />
            <Alert />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes for Authenticated Users */}
              <Route element={<PrivateRoute />}>
                <Route path="/bookings" element={<Bookings />} />
                {/* Add other protected non-admin routes here */}
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="conflicts" element={<ConflictResolution />} />
                <Route path="user-approval" element={<UserApproval />} />
              </Route>

              {/* Catch-All Route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
      </AlertProvider>
        </Router>
    </AuthProvider>
  );
}

export default App;