import axios from "axios";
import React, { useEffect, useState , useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        pastBookings: 0,
        mostBookedResource: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`/api/bookings/stats`);
                setStats(res.data);
            } catch (err) {
                console.log(err);
                setError('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    },[]);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome {user?.name}</p>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Bookings</h3>
                    <p>{stats.totalBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Upcoming Bookings</h3>
                    <p>{stats.upcomingBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Past Bookings</h3>
                    <p>{stats.pastBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Most Booked Resource</h3>
                    <p>{stats.mostBookedResource}</p>
                </div>
                <nav>
        <ul>
          <li><Link to="/bookings">Bookings</Link></li>
          <li><Link to="/visual-booking">Visual Booking</Link></li>
          <li><Link to="/savera-school">Savera School Bookings</Link></li>
          <li><Link to="/admin/conflicts">Admin Conflict Resolution</Link></li>
        </ul>
      </nav>
            </div>
        </div>
    );
};

export default Dashboard;