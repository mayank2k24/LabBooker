import React, { useContext, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useBookings } from '../../context/BookingContext';
import { useAlert } from '../../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import { formatSystemName } from '../utils/Validation';

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const { allBookings, fetchAllBookings } = useBookings();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const events = allBookings.map(booking => ({
    id: booking._id,
    title: `${formatSystemName(booking.resource)}`, 
    start: new Date(booking.start), 
    end: new Date(booking.end),
  }));

  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <button onClick={() => handleEditBooking(event)}>Edit</button>
    </div>
  );

  const handleEditBooking = (event) => {
    // Implement edit functionality here
    console.log('Editing booking:', event);
    setAlert('Editing booking...', 'info');
    // You might want to navigate to an edit page or open a modal
    // navigate(`/edit-booking/${event.id}`);
    // Find the original booking object
    const originalBooking = allBookings.find(booking => booking._id === event.id);
    
    if (originalBooking) {
      navigate('/edit-booking', { 
        state: { 
          bookingId: originalBooking._id,
          resource: originalBooking.resource,
          start: originalBooking.start,
          end: originalBooking.end
        } 
      });
    } else {
      setAlert('Booking not found', 'error');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    // Implement new booking functionality here
    console.log('Creating new booking:', slotInfo);
    setAlert('Creating new booking...', 'info'); 
    const selectedResource = getSelectedResource();
  
    navigate('/bookings', { 
      state: { 
        startTime: slotInfo.start, 
        endTime: slotInfo.end,
        resource: selectedResource // Add the resource here
      } 
    });
  };

  const getSelectedResource = () => {
    // Get the selected resource from the calendar view
    const selectedView = this.calendar.current.getView();
    if (selectedView && selectedView.resource) {
      return selectedView.resource.title;
    }
    // If no resource is selected, return a default value
    return 'Default Resource';
  };

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
        onSelectSlot={handleSelectSlot}
        selectable={true}
      />
    </div>
  );
};

export default BookingCalendar;