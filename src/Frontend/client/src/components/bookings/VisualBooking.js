import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useBookings } from '../../context/BookingContext';
import styles from './VisualBooking.module.css';
import { Layouts } from './Layouts';
import CalendarView from './CalendarView';
import Legend from './Legend';
import LabLayout from '../layout/LabLayout';

const VisualBooking = () => {
  const [selectedLab, setSelectedLab] = useState(Object.keys(Layouts)[0]);
  const [seats, setSeats] = useState([]);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const { addBooking, fetchAllBookings } = useBookings();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(bookingDate, 'yyyy-MM-dd');
      const response = await axios.get(`/api/bookings/${selectedLab}/${formattedDate}`);
      updateSeatsStatus(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [selectedLab, bookingDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateSeatsStatus = (bookings) => {
    const updatedSeats = Layouts[selectedLab].seatArrangement.flat().filter(Boolean).map(seatNumber => ({
      id: `${selectedLab}-${seatNumber}`,
      number: seatNumber,
      status: bookings.some(booking => 
        booking.resourceId === `${selectedLab}-${seatNumber}` &&
        new Date(booking.start) <= new Date() &&
        new Date(booking.end) >= new Date()
      ) ? 'booked' : 'available'
    }));
    setSeats(updatedSeats);
  };

  const handleBooking = async () => {
    if (!selectedSeat || !startTime || !endTime) {
      toast.warn('Please select a seat and both start and end times.');
      return;
    }

    try {
      const response = await axios.post('/api/bookings', {
        resourceId: `${selectedLab}-${selectedSeat}`,
        start: `${format(bookingDate, 'yyyy-MM-dd')}T${startTime}:00`,
        end: `${format(bookingDate, 'yyyy-MM-dd')}T${endTime}:00`
      });
      
      if (response.data && response.data._id) {
        toast.success('Booking successful!');
        addBooking(response.data);  // Add the new booking to shared state
        fetchBookings(); 
        setSelectedSeat(null);
        setStartTime('');
        setEndTime('');
      } else {
        throw new Error('Booking failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
      console.error('Booking error:', err);
    }
  };

  const handleDateChange = (date) => {
    setBookingDate(date);
  };

  const handleLabChange = (e) => {
    setSelectedLab(e.target.value);
  };

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.visualBooking}>
      <h2>Lab Booking</h2>
      <div className={styles.bookingContainer}>
        <div className={styles.leftPanel}>
          <CalendarView selectedDate={bookingDate} onDateChange={handleDateChange} />
          <div className={styles.controlPanel}>
            <select value={selectedLab} onChange={handleLabChange}>
              {Object.keys(Layouts).map(labId => (
                <option key={labId} value={labId}>{Layouts[labId].name}</option>
              ))}
            </select>
            <div className={styles.timeInputs}>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start Time"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End Time"
              />
            </div>
            <button onClick={handleBooking}>Book Selected Seat</button>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <LabLayout 
            layout={Layouts[selectedLab]} 
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatClick={handleSeatClick} 
          />
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default VisualBooking;