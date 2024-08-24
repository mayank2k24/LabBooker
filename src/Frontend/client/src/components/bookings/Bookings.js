import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from "../../context/AuthContext";
import AlertContext from "../../context/AlertContext";
import * as Yup from "yup";
import styles from "./Bookings.module.css";
import BookingCalendar from "./BookingCalendar";
import EditBooking from "./EditBooking";
import LabLayout from "../layout/LabLayout";
import SaveraSchoolBooking from './SaveraSchoolBooking';

axios.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
      // Update your auth context or state management here
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [formData, setFormData] = useState({
    system: "",
    startTime: null,
    endTime: null,
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { system, startTime, endTime } = formData;
  const { user, token } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [editingBooking, setEditingBooking] = useState(null);
  const [resources, setResources] = useState([]);
  const [showLabLayout, setShowLabLayout] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [bookingType,setBookingType] = useState('regular');

  useEffect(() => {
    if (token) {
      getBookings();
      getAllBookings();
      fetchResources();
      fetchBookingHistory();
    }
  }, [currentPage, searchTerm, token]);

  const fetchResources = async () => {
    try {
      const res = await axios.get("/api/resources");
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setAlert("Failed to fetch resources", "danger");
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const res = await axios.get("/api/bookings/history");
      setBookingHistory(res.data);
    } catch (err) {
      console.error("Error fetching booking history:", err);
      setAlert("Failed to fetch booking history", "danger");
    }
  };


  const fetchResourcesForDate = async (date) => {
    try {
      const res = await axios.get(
        `/api/resources/available?date=${date.toISOString()}`
      );
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources for date:", err);
      setAlert("Failed to fetch available resources", "danger");
    }
  };

  // const handleBooking = async () => {
  //   if (!selectedSystem || !bookingDate) {
  //     setAlert("Please select a system and date", "danger");
  //     return;
  //   }

  //   try {
  //     const startDate = new Date(bookingDate);
  //     const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 1 hour later

  //     const bookingData = {
  //       resourceId: selectedSystem.id,
  //       resource: selectedSystem.name,
  //       start: startDate.toISOString(),
  //       end: endDate.toISOString(),
  //     };

  //     console.log("Sending booking data:", JSON.stringify(bookingData, null, 2));

  //     const res = await axios.post("/api/bookings", bookingData);

  //     console.log("Booking response:", res.data);

  //     setAlert("Booking successful", "success");
  //     fetchBookingHistory();
  //     setSelectedSystem(null);
  //   } catch (err) {
  //     console.error('Error in handleBooking:', err);
  //     console.error('Error response:', err.response?.data);
  //     setAlert(err.response?.data?.error || 'Booking failed. Please try again.', 'danger');
  //   }
  // };

  const toggleLabLayout = () => {
    setShowLabLayout((prevState) => !prevState);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setBookingType('regular');
  };

  const handleUpdate = async (updatedBooking) => {
    try {
      const res = await axios.put(`/api/bookings/${updatedBooking._id}`, updatedBooking);
      setBookings(bookings.map(booking => 
        booking._id === res.data._id ? res.data : booking
      ));
      setEditingBooking(null);
      setAlert("Booking updated successfully", "success");
      getBookings(); // Refresh the bookings list
    } catch (err) {
      setAlert(err.response?.data?.msg || "Failed to update booking", "danger");
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
      if (res.data && typeof res.data === "object") {
        if (Array.isArray(res.data.bookings)) {
          setBookings(res.data.bookings);
          setTotalPages(res.data.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          setBookings(res.data);
          setTotalPages(1);
        } else {
          throw new Error("Unexpected data structure");
        }
      } else {
        throw new Error("Invalid response data");
      }
    } catch (err) {
      setAlert("Failed to fetch bookings", "danger");
      setBookings([]);
      setTotalPages(1);
    }
  };

  const getAllBookings = async () => {
    try {
      const res = await axios.get("/api/bookings/all");
      if (Array.isArray(res.data)) {
        const currentTime = new Date();
        const validBookings = res.data.filter(booking => new Date(booking.end) > currentTime);
        setBookings(validBookings);
        setTotalPages(1);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (err) {
      setAlert("Failed to fetch bookings", "danger");
      setBookings([]);
      setTotalPages(1);
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const validationSchema = Yup.object().shape({
    system: Yup.string().required("System is required"),
    startTime: Yup.date().required("Start time is required"),
    endTime: Yup.date()
      .required("End time is required")
      .min(Yup.ref("startTime"), "End time must be after start time"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        resource: system,
        resourceId: system,
        description: "",
      });
      await axios.post("/api/bookings", body, config);
      getBookings();
      setFormData({ system: "", startTime: null, endTime: null });
      setAlert("Booking created successfully", "success");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(
          "Error creating booking:",
          err.response?.data || err.message
        );
        setAlert(
          `Failed to create booking: ${
            err.response?.data?.message || err.message
          }`,
          "danger"
        );
      }
    }
  };

  const deleteBooking = async (id) => {
    try {
      const res = await axios.delete(`/api/bookings/${id}`);
      getBookings();
      setAlert("Booking deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting booking:", err.response?.data || err);
    let errorMessage = "Failed to delete booking.";
    if (err.response && err.response.status === 400) {
      errorMessage = err.response.data.msg || "Invalid date range. Please select a valid slot.";
    } else {
      errorMessage = err.response?.data?.msg || err.message;
    }
    setAlert(errorMessage, "danger");
    }
  };

  return (
    <div className={styles.bookings}>
      <h1>Welcome, {user && user.name}</h1>
      <h2>Book a System</h2>
      <select onChange={(e) => setBookingType(e.target.value)}>
        <option value="regular">Regular Booking</option>
        <option value="savera">Savera School Booking</option>
      </select>
      
      {bookingType === 'regular' ? (
  editingBooking ? (
    <EditBooking
      booking={editingBooking}
      onClose={() => setEditingBooking(null)}
      onUpdate={handleUpdate}
    />
  ) : null
) : (
  <SaveraSchoolBooking />
)}
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="System"
            name="system"
            value={system}
            onChange={(e) => onChange(e)}
            className={errors.system ? "is-invalid" : ""}
          />
          {errors.system && (
            <div className="invalid-feedback">{errors.system}</div>
          )}
        </div>
        <div className="form-group">
          <DatePicker
            selected={startTime}
            onChange={(date) => onDateChange(date, "startTime")}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Start Time"
            className={errors.startTime ? "is-invalid" : ""}
          />
          {errors.startTime && (
            <div className="invalid-feedback">{errors.startTime}</div>
          )}
        </div>
        <div className="form-group">
          <DatePicker
            selected={endTime}
            onChange={(date) => onDateChange(date, "endTime")}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="End Time"
            className={errors.endTime ? "is-invalid" : ""}
          />
          {errors.endTime && (
            <div className="invalid-feedback">{errors.endTime}</div>
          )}
        </div>
        <input type="submit" value="Book System" className="btn btn-primary" />
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
        <button
          onClick={toggleLabLayout}
          className={showLabLayout ? styles.active : ""}>
          {showLabLayout ? "Hide Lab Layout" : "Show Lab Layout"}
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
  
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className={styles.bookingItem}>
                <h3>System: {booking.resource}</h3>
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
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <div className={styles.bookingsContainer}>
          <h2>Your Bookings</h2>
          {editingBooking && (
            <EditBooking
              booking={editingBooking}
              onClose={() => setEditingBooking(null)}
              onUpdate={handleUpdate}
            />
          )}
          <BookingCalendar bookings={bookings} onEditBooking={handleEdit} />
        </div>
      )}
      {showLabLayout && (
        <div className={styles.labLayoutContainer}>
          <h2>Lab Layout</h2>
          {resources.length > 0 ? (
            <LabLayout width={600} height={400} resources={resources} />
          ) : (
            <p>Loading resources...</p>
          )}
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
    </div>
  );
};

export default Bookings;
