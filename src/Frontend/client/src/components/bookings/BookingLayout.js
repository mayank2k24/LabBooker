// src/Frontend/src/components/BookingLayout.js
import React, { useState } from 'react';
import Booking from './Booking';
import SaveraSchoolBooking from './SaveraSchoolBooking';

const BookingLayout = () => {
  const [bookingType, setBookingType] = useState('regular');

  return (
    <div>
      <h2>Booking System</h2>
      <select onChange={(e) => setBookingType(e.target.value)}>
        <option value="regular">Regular Booking</option>
        <option value="savera">Savera School Booking</option>
      </select>
      
      {bookingType === 'regular' ? <Booking /> : <SaveraSchoolBooking />}
    </div>
  );
};

export default BookingLayout;