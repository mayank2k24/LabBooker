import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AlertContext from '../../context/AlertContext';
import ConflictResolution from './ConflictResolution';
import styles from './EditBooking.module.css';

const EditBooking = ({ booking, onClose, onUpdate }) => {
  const { setAlert } = useContext(AlertContext);
  const [conflicts, setConflicts] = useState(null);
  const [editedBooking, setEditedBooking] = useState({
    title: '',
    start: new Date(booking.start),
    end: new Date(booking.end),
    description: '',
    resource: '',
});

useEffect(() => {
  if (booking) {
    setEditedBooking({
      ...booking,
      start: new Date(booking.start),
      end: new Date(booking.end)
    });
  }
}, [booking]);

if (!booking || !editedBooking) {
  return <div>Loading...</div>;
}


const handleChange = (e) => {
  const { name, value } = e.target;
  setEditedBooking(prev => ({ ...prev, [name]: value }));
};

const handleDateChange = (date, field) => {
  setEditedBooking(prev => ({ ...prev, [field]: date }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!booking) {
    setAlert('No booking to update', 'danger');
    return;
  }
  try {
    const updatedBooking = {
      _id: booking._id,
      title: editedBooking.title,
      start: editedBooking.start.toISOString(),
      end: editedBooking.end.toISOString(),
      description: editedBooking.description,
      resource: editedBooking.resource,
      resourceId: editedBooking.resource
    };
    const res = await axios.put(`/api/bookings/${booking._id}`, updatedBooking);
    onUpdate(res.data);
    setAlert('Booking updated successfully', 'success');
    onClose();
  } catch (err) {
    if (err.response?.status === 409 && err.response?.data?.conflicts) {
      setConflicts(err.response.data.conflicts);
    } else {
      setAlert(err.response?.data?.msg || 'Error updating booking', 'danger');
    }
  }
};

  const handleConflictResolution = async (action) => {
    if (action === 'adjust') {
      setConflicts(null);
    } else if (action === 'override') {
      try {
        const updatedBooking = {
          _id: booking._id,
          title: editedBooking.title,
          start: editedBooking.start.toISOString(),
          end: editedBooking.end.toISOString(),
          description: editedBooking.description,
          resource: editedBooking.resource,
          resourceId: editedBooking.resource
        };
        const res = await axios.put(`/api/bookings/${booking._id}?override=true`, updatedBooking);
        onUpdate(res.data);
        setAlert('Booking updated successfully', 'success');
        onClose();
      } catch (err) {
        setAlert(err.response?.data?.msg || 'Error updating booking', 'danger');
      }
    } else if (action === 'cancel') {
      setConflicts(null);
      onClose();
    }
  };

  if (conflicts) {
    return <ConflictResolution conflicts={conflicts} onResolve={handleConflictResolution} />;
  }

  return (
    <div className={styles.editBookingOverlay}>
      <div className={styles.editBookingModal}>
        <h2>Edit Booking</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>System:</label>
            <input
              type="text"
              name="resource"
              value={editedBooking.resource}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <DatePicker
              selected={editedBooking.start}
              onChange={(date) => handleDateChange(date, 'start')}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div>
            <label>End Time:</label>
            <DatePicker
              selected={editedBooking.end}
              onChange={(date) => handleDateChange(date, 'end')}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <button type="submit">Update Booking</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;