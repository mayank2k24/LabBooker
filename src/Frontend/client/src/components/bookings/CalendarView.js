import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './CalendarView.module.css';
import { format } from 'date-fns';
import { useBookings } from '../../context/BookingContext';

const CalendarView = ({ selectedDate, onDateChange }) => {
  const { bookings } = useBookings();

  const tileClassName = ({ date }) => {
    if (!bookings || !Array.isArray(bookings)) return '';
    const hasBooking = bookings.some(booking => {
      const bookingDate = new Date(booking.start);
      return (
        date.getDate() === bookingDate.getDate() &&
        date.getMonth() === bookingDate.getMonth() &&
        date.getFullYear() === bookingDate.getFullYear()
      );
    });

    return hasBooking ? 'has-booking' : '';
  };

  const tileContent = ({ date }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings.filter(booking => 
      format(new Date(booking.start), 'yyyy-MM-dd') === formattedDate
    );

    return dayBookings.length > 0 ? (
      <div className={styles.bookingCount}>
        {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
      </div>
    ) : null;
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        className={styles.reactCalendar}
        tileClassName={tileClassName}
        tileContent={tileContent}
        minDate={new Date()}
        maxDetail="month"
        minDetail="month"
      />
    </div>
  );
};

export default CalendarView;