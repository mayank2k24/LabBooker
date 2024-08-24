import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BookingCalendar = ({ bookings, onEditBooking }) => {
  const events = bookings.map(booking => ({
    id: booking._id,
    title: `${booking.system}`,
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
  }));

  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <button onClick={() => onEditBooking(event)}>Edit</button>
    </div>
  );


  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        components={{
        event: EventComponent
      }}
      />
    </div>
  );
};

export default BookingCalendar;