import React, { useState, useCallback, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useBookings } from '../../context/BookingContext';
import styles from './VisualBooking.module.css';
import { Layouts } from './Layouts';
import CalendarView from './CalendarView';
import Legend from './Legend';
import LabLayout from '../layout/LabLayout';
import { AuthContext } from '../../context/AuthContext';

const VisualBooking = () => {
  const [selectedLab, setSelectedLab] = useState(Object.keys(Layouts)[0]);
  const [seats, setSeats] = useState([]);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const {user} = useContext(AuthContext);
  const {createBooking,fetchBookingsByDate} = useBookings();

  const updateSeatsStatus = useCallback((bookingsData = []) => {
    if (!Layouts[selectedLab]?.seatArrangement) {
      console.error('Invalid lab layout:', selectedLab);
      return;
    }

    const updatedSeats = Layouts[selectedLab].seatArrangement
      .flat()
      .filter(Boolean)
      .map(seatNumber => ({
        id: `${selectedLab}-${seatNumber}`,
        number: seatNumber,
        status: bookingsData.some(booking => 
          booking.resourceId === `${selectedLab}-${seatNumber}` &&
          new Date(booking.start) <= new Date() &&
          new Date(booking.end) >= new Date()
        ) ? 'booked' : 'available'
      }));
    setSeats(updatedSeats);
  }, [selectedLab]);

  const fetchBookings = useCallback(async () => {
    if (!selectedLab || loading) return;

    const cacheKey = `${selectedLab}-${format(bookingDate, 'yyyy-MM-dd')}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      updateSeatsStatus(JSON.parse(cached));
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(bookingDate, 'yyyy-MM-dd');
      const bookingsData = await fetchBookingsByDate(selectedLab, formattedDate);
      sessionStorage.setItem(cacheKey, JSON.stringify(bookingsData));
      updateSeatsStatus(bookingsData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [selectedLab, bookingDate, fetchBookingsByDate, updateSeatsStatus,loading]);

  useEffect(() => {
    const debounceTimer=setTimeout(() => {
      fetchBookings();
    }, 1000);
    return () => clearTimeout(debounceTimer);
  }, [selectedLab, bookingDate]);

  const handleBooking = async () => {
    if (!selectedSeat || !startTime || !endTime) {
      toast.warn('Please select a seat and both start and end times.');
      return;
    }

    try {
      const bookingData = {
        resourceId: `${selectedLab}-${selectedSeat}`,
        start: `${format(bookingDate, 'yyyy-MM-dd')}T${startTime}:00`,
        end: `${format(bookingDate, 'yyyy-MM-dd')}T${endTime}:00`,
        user: user._id
      };

      const existingBookings = await fetchBookingsByDate(selectedLab, format(bookingDate, 'yyyy-MM-dd'));
      const hasConflict = existingBookings.some(booking => 
        booking.resourceId === bookingData.resourceId &&
        new Date(booking.start) <= new Date(bookingData.end) &&
        new Date(booking.end) >= new Date(bookingData.start)
      );
  
      if (hasConflict) {
        toast.error('This time slot is already booked');
        return;
      }
  
      console.log('Creating booking with data:', bookingData);
      await createBooking(bookingData);
      toast.success('Booking created successfully');
      setSelectedSeat(null);
      setStartTime('');
      setEndTime('');
      await fetchBookings();
    } catch (err) {
      console.error('Booking creation error:', err);
    toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


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
          <CalendarView selectedDate={bookingDate} onDateChange={handleDateChange} bookings={seats.filter(seat => seat.status === 'booked')} />
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