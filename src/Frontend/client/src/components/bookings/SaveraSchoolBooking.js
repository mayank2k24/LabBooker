
import React, { useState } from 'react';
import axios from 'axios';

const SaveraSchoolBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ date: '', startTime: '', endTime: '', subject: '' });

  const handleBooking = async () => {
    const res = await axios.post('/api/savera-school/bookings', newBooking);
    setBookings([...bookings, res.data]);
    setNewBooking({ date: '', startTime: '', endTime: '', subject: '' });
  };

  return (
    <div>
      <h2>Savera School Bookings</h2>
      <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({...newBooking, date: e.target.value})} />
      <input type="time" value={newBooking.startTime} onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})} />
      <input type="time" value={newBooking.endTime} onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})} />
      <input type="text" value={newBooking.subject} onChange={(e) => setNewBooking({...newBooking, subject: e.target.value})} placeholder="Subject" />
      <button onClick={handleBooking}>Book Slot</button>

      {bookings.map(booking => (
        <div key={booking._id}>
          <p>Date: {booking.date}</p>
          <p>Time: {booking.startTime} - {booking.endTime}</p>
          <p>Subject: {booking.subject}</p>
        </div>
      ))}
    </div>
  );
};

export default SaveraSchoolBooking;