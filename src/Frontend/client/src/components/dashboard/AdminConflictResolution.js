// AdminConflictResolution.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminConflictResolution = () => {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    const res = await axios.get('/api/admin/conflicts');
    setConflicts(res.data);
  };

  const resolveConflict = async (conflictId, resolution) => {
    await axios.post(`/api/admin/resolve-conflict/${conflictId}`, { resolution });
    fetchConflicts();
  };

  return (
    <div>
      <h2>Booking Conflicts</h2>
      {conflicts.map(conflict => (
        <div key={conflict._id}>
          <p>Conflict between: {conflict.bookings.map(b => b.user).join(', ')}</p>
          <p>Resource: {conflict.resource}</p>
          <p>Time: {new Date(conflict.start).toLocaleString()} - {new Date(conflict.end).toLocaleString()}</p>
          <button onClick={() => resolveConflict(conflict._id, 'keep-first')}>Keep First Booking</button>
          <button onClick={() => resolveConflict(conflict._id, 'keep-second')}>Keep Second Booking</button>
          <button onClick={() => resolveConflict(conflict._id, 'split-time')}>Split Time</button>
        </div>
      ))}
    </div>
  );
};

export default AdminConflictResolution;