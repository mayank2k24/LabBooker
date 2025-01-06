import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useBookings } from '../../context/BookingContext';
import { useAlert } from '../../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import { formatSystemName } from '../utils/Validation';
import styles from './BookingCalendar.module.css';

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const { bookings, fetchAllBookings, setSelectedBooking } = useBookings();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const EventComponent = ({ event }) => (
    <div className={styles.eventContainer}>
      <strong>{event.title}</strong>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleEditBooking(event);
        }}
        className={styles.editButton}
      >
        Edit
      </button>
    </div>
  );

  const handleEditBooking = (event) => {
    const booking = bookings.find(b => b._id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      setAlert('Editing booking...', 'info');
      navigate('/edit-booking', { 
        state: { 
          bookingId: booking._id,
          resourceId: booking.resourceId,
          start: booking.start,
          end: booking.end
        } 
      });
    } else {
      setAlert('Booking not found', 'error');
    }
  };


  const handleSelectSlot = (slotInfo) => {
    const now = moment();
    const selectedStart = moment(slotInfo.start);

    if (selectedStart.isBefore(now)) {
      setAlert('Cannot create bookings in the past', 'error');
      return;
    }

    setAlert('Creating new booking...', 'info');
    navigate('/bookings', { 
      state: { 
        startTime: slotInfo.start, 
        endTime: slotInfo.end,
        resourceId: ''
      } 
    });
  };

  const eventStyleGetter = (event) => {
    const isActive = moment(event.start).isSameOrBefore(moment()) && 
                    moment(event.end).isAfter(moment());
    return {
      className: isActive ? styles.activeEvent : styles.normalEvent
    };
  };

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        localizer={localizer}
        events={(bookings || []).map(booking => ({
          id: booking._id,
          title: formatSystemName(booking.resourceId) || 'Unknown System',
          start: new Date(booking.start),
          end: new Date(booking.end),
        }))}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEditBooking}
        onSelectSlot={handleSelectSlot}
        selectable={true}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent
        }}
        views={['month', 'week', 'day']}
        defaultView='week'
        min={moment().set('hour', 8).toDate()}
        max={moment().set('hour', 20).toDate()}
        step={120}
        timeslots={1}
      />
    </div>
  );
};

export default BookingCalendar;