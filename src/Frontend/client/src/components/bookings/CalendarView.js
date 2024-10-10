import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './CalendarView.module.css';

const CalendarView = ({ selectedDate, onDateChange }) => {
  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        className={styles.reactCalendar}
      />
    </div>
  );
};

export default CalendarView;