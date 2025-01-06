import React, { useState, useEffect, useContext } from "react";
import { ValidateSystem, formatSystemName } from "../utils/Validation";
import { useNavigate, useLocation } from "react-router-dom";
import { useBookings } from '../../context/BookingContext';
import AuthContext from "../../context/AuthContext";
import AlertContext from "../../context/AlertContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import styles from "./Bookings.module.css";
import BookingCalendar from "./BookingCalendar";
import EditBooking from "./EditBooking";
import UndoFooter from '../utils/UndoFooter';
import { createBooking } from './BookingConflict';
import HelpIcon from '../HelpIcon.js';

export default function Bookings() {
  const [localBookings, setLocalBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState("list");
  const [formData, setFormData] = useState({
    system: location.state?.resource || "",
    startTime: location.state?.startTime || null,
    endTime: location.state?.endTime || null,
  });
  const [errors, setErrors] = useState({});
  const [showUndoFooter, setShowUndoFooter] = useState(false);
  const [undoAction, setUndoAction] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  const { allBookings, setAllBookings, fetchAllBookings } = useBookings();
  const { user, token } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    const controller = new AbortController();
  
  if (token) {
    const loadData = async () => {
      try {
        await fetchAllBookings();
        await fetchBookingHistory();
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error fetching data:', err);
          setAlert('Failed to fetch bookings', 'error');
        }
      }
    };
    loadData();
  }

  return () => controller.abort();
}, [token]);

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        system: location.state.resource || prev.system,
        startTime: location.state.startTime || prev.startTime,
        endTime: location.state.endTime || prev.endTime
      }));
    }
  }, [location.state]);

  const fetchBookingHistory = async () => {
    try {
      const res = await axios.get("/api/bookings/history");
      setBookingHistory(res.data);
    } catch (err) {
      console.error("Error fetching booking history:", err);
      setAlert("Failed to fetch booking history", "danger");
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };

  const handleUpdate = async (updatedBooking) => {
    try {
      const res = await axios.put(`/api/bookings/${updatedBooking._id}`, updatedBooking);
      setAllBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === updatedBooking._id ? res.data : booking
        )
      );
      setEditingBooking(null);
      setAlert("Booking updated successfully", "success");
    } catch (err) {
      console.error("Error updating booking:", err);
      setAlert("Failed to update booking", "danger");
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const bookingToDelete = allBookings.find(b => b._id === bookingId);
      await axios.delete(`/api/bookings/${bookingId}`);
      setAllBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
      setAlert("Booking deleted successfully", "success");
      setShowUndoFooter(true);
      setUndoAction({ type: 'delete', data: bookingToDelete });
    } catch (err) {
      console.error("Error deleting booking:", err);
      setAlert("Failed to delete booking", "danger");
    }
  };

  const handleUndo = async () => {
    if (!undoAction) return;

    try {
      switch (undoAction.type) {
        case 'create':
          await deleteBooking(undoAction.data._id);
          setAlert('Booking creation undone', 'success');
          break;
        case 'delete':
          const res = await axios.post('/api/bookings', undoAction.data);
          setAllBookings(prevBookings => [...prevBookings, res.data]);
          setAlert('Booking deletion undone', 'success');
          break;
        default:
          console.error('Unknown undo action type');
      }
    } catch (err) {
      console.error('Error undoing action:', err);
      setAlert('Failed to undo action', 'danger');
    } finally {
      setShowUndoFooter(false);
      setUndoAction(null);
    }
  };

  const closeUndoFooter = () => {
    setShowUndoFooter(false);
    setUndoAction(null);
  };

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const onDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!ValidateSystem(formData.system)){
      setAlert("Invalid system name", "danger");
      return;
    }
    try {
      if (!formData.system || !formData.startTime || !formData.endTime || !user) {
        setAlert("Please fill all fields and ensure you're logged in", "danger");
        return;
      }
      const bookingData = {
        resourceId: formData.system, 
        start: formData.startTime.toISOString(),
        end: formData.endTime.toISOString(),
        user: user._id
      };
      console.log('Submitting booking data:', bookingData);
      const newBooking = await createBooking(bookingData);
      setAlert("Booking created successfully", "success");
      setFormData({ system: "", startTime: null, endTime: null });
      setShowUndoFooter(true);
      setUndoAction({ type: 'create', data: newBooking });
      await fetchAllBookings();
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);

    } catch (err) {
      console.error("Error creating booking:", err);
      setAlert(err.response?.data?.message || "Failed to create booking", "danger");
    }
  };

  return (
    <div className={styles.bookings}>
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="system">System:</label>
          <input
            type="text"
            id="system"
            name="system"
            value={formData.system}
            onChange={(e) => setFormData({ ...formData, system: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <DatePicker
            selected={formData.startTime}
            onChange={(date) => onDateChange(date, 'startTime')}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <DatePicker
            selected={formData.endTime}
            onChange={(date) => onDateChange(date, 'endTime')}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <button type="submit">Create Booking</button>
      </form>

      <h2>Your Bookings</h2>
      <div className={styles.viewToggle}>
        <button
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? styles.active : ""}>
          List View
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={viewMode === "calendar" ? styles.active : ""}>
          Calendar View
        </button>
      </div>
      {viewMode === "list" ? (
        <>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={onSearchChange}
            className={styles.searchInput}
          />
          <h2>Current Bookings</h2>
          {Array.isArray(allBookings) && allBookings.length > 0 ? (
            allBookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className={styles.bookingItem}>
                <h3>System: {formatSystemName(booking.resource)}</h3>
                <p>Start Time: {new Date(booking.start).toLocaleString()}</p>
                <p>End Time: {new Date(booking.end).toLocaleString()}</p>
                <div className={styles.bookingActions}>
                  <button onClick={() => handleEdit(booking)} className={styles.editBtn}>
                    Edit
                  </button> 
                  <button
                    onClick={() => deleteBooking(booking._id || booking.id)}
                    className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </>
      ) : (
        <div className={styles.bookingsContainer}>
          {editingBooking && (
            <EditBooking
              booking={editingBooking}
              onClose={() => setEditingBooking(null)}
              onUpdate={handleUpdate}
            />
          )}
          <BookingCalendar bookings={allBookings} onEditBooking={handleEdit} />
        </div>
      )}
      <div className={styles.bookingHistoryContainer}>
        <h2>Booking History</h2>
        {bookingHistory.length > 0 ? (
          <ul>
            {bookingHistory.map((booking) => (
              <li key={booking._id}>
                System: {booking.resource}, Date:{" "}
                {booking.start
                  ? new Date(booking.start).toLocaleString()
                  : "Invalid Date"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No booking history available.</p>
        )}
      </div>
      {showUndoFooter && (
        <UndoFooter 
          message={`${undoAction?.type?.charAt(0).toUpperCase() + undoAction?.type?.slice(1)} action performed. Undo?`}
          onUndo={handleUndo}
          onClose={closeUndoFooter}
          duration={5000}
        />
      )}
      <HelpIcon />
    </div>
  );
}