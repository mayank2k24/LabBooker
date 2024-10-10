import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ConflictResolution = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/conflicts');
      setConflicts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conflicts:', err);
      setError('Failed to fetch conflicts. Please try again.');
      setLoading(false);
    }
  };

  const handleResolve = async (conflictId, resolution) => {
    try {
      await axios.post(`/api/admin/resolve-conflict/${conflictId}`, { resolution });
      // Remove the resolved conflict from the list
      setConflicts(conflicts.filter(conflict => conflict._id !== conflictId));
    } catch (err) {
      console.error('Error resolving conflict:', err);
      setError('Failed to resolve conflict. Please try again.');
    }
  };

  if (loading) return <div>Loading conflicts...</div>;
  if (error) return <div>{error}</div>;

  if (conflicts.length === 0) {
    return (
      <div>
        <h3>No Conflicts</h3>
        <p>There are currently no booking conflicts to resolve.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Conflict Resolution</h2>
      {conflicts.map(conflict => (
        <div key={conflict._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>Conflict ID: {conflict._id}</h3>
          <p>Conflicting Bookings:</p>
          <ul>
            {conflict.bookings.map(booking => (
              <li key={booking._id}>
                User: {booking.user.name} - 
                Resource: {booking.resource.name} - 
                Time: {moment(booking.startTime).format('MMMM D, YYYY h:mm A')} to {moment(booking.endTime).format('MMMM D, YYYY h:mm A')}
              </li>
            ))}
          </ul>
          <div>
            <button onClick={() => handleResolve(conflict._id, 'approve')}>Approve First Booking</button>
            <button onClick={() => handleResolve(conflict._id, 'reject')}>Reject All</button>
            <button onClick={() => handleResolve(conflict._id, 'manual')}>Resolve Manually</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConflictResolution;