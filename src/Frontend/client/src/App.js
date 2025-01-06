import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Home from "./components/pages/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Bookings from "./components/bookings/Bookings";
import PrivateRoute from "./components/routing/PrivateRoute";
import ProtectedAdminRoute from "./components/routing/ProtectedAdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ConflictResolution from "./components/bookings/ConflictResolution";
import UserApproval from "./components/dashboard/UserApproval";
import VisualBooking from "./components/bookings/VisualBooking";
import { BookingProvider } from "./context/BookingContext";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import "./App.css";

function App() {
  useEffect(() => {
    document.title = "LabBooker";
  }, []);

  return (
    <Router>
      <BookingProvider>
        <AuthProvider>
          <AlertProvider>
            <div className="App">
              <Navbar />
              <Alert />
              <Routes>
                {/* Public Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password/:token"element={<ResetPassword />}  />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes for Authenticated Users */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/visual-booking" element={<VisualBooking />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedAdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="conflicts" element={<ConflictResolution />} />
                    <Route path="user-approval" element={<UserApproval />} />
                  </Route>
                </Route>
                {/* Catch-All Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AlertProvider>
        </AuthProvider>
      </BookingProvider>
    </Router>
  );
}

export default App;
