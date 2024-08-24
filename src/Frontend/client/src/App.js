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
import Dashboard from './components/dashboard/Dashboard';
import VisualBooking from './components/bookings/VisualBooking';
import AdminConflictResolution from './components/dashboard/AdminConflictResolution';
import SaveraSchoolBooking from './components/bookings/SaveraSchoolBooking';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Alert />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/visual-booking" element={<VisualBooking />} />
                  <Route path="/savera-school" element={<SaveraSchoolBooking />} />
                  <Route path="/admin/conflicts" element={<AdminConflictResolution />} />
                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;