
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const SaveraSchoolBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ date: '', startTime: '', endTime: '', seat: '',classroom: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/savera/bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };


  const handleBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/savera/bookings', newBooking);
      setBookings([...bookings, res.data]);
      setNewBooking({ date: '', startTime: '', endTime: '', seat: '', classroom: '' });
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Savera School Bookings</h2>
      <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({...newBooking, date: e.target.value})} />
      <input type="time" value={newBooking.startTime} onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})} />
      <input type="time" value={newBooking.endTime} onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})} />
      <input type="text" value={newBooking.seat} onChange={(e) => setNewBooking({...newBooking, seat: e.target.value})} placeholder="Seat" />
      <input type="text" value={newBooking.classroom} onChange={(e) => setNewBooking({...newBooking, classroom: e.target.value})} placeholder="Classroom" />
      <button onClick={handleBooking}>Book Slot</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {bookings.map(booking => (
        <div key={booking._id}>
          <p>Date: {booking.date}</p>
          <p>Time: {booking.startTime} - {booking.endTime}</p>
          <p>classroom: {booking.classroom}</p>
          <p>seat: {booking.seat}</p>
        </div>
      ))}
    </div>
  );
};

export default SaveraSchoolBooking;