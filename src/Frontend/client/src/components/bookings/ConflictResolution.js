import React from 'react';
import moment from 'moment';

const ConflictResolution = ({ conflicts, onResolve }) => {
  return (
    <div>
      <h3>Booking Conflict Detected</h3>
      <p>The following bookings conflict with your selected time:</p>
      <ul>
        {conflicts.map(conflict => (
          <li key={conflict._id}>
            {conflict.title} - {moment(conflict.start).format('MMMM D, YYYY h:mm A')} to {moment(conflict.end).format('MMMM D, YYYY h:mm A')}
          </li>
        ))}
      </ul>
      <p>What would you like to do?</p>
      <button onClick={() => onResolve('adjust')}>Adjust my booking</button>
      <button onClick={() => onResolve('override')}>Override existing bookings</button>
      <button onClick={() => onResolve('cancel')}>Cancel my booking</button>
    </div>
  );
};

export default ConflictResolution;