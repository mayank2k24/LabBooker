import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VisualBooking.module.css';
import LabLayout from '../layout/LabLayout';

const VisualBooking = () => {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState('standard');

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/systems');
      setSystems(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch systems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSelect = (systemId) => {
    const system = systems.find(s => s._id === systemId);
    setSelectedSystem(system);
  };

  const bookSystem = async () => {
    if (selectedSystem) {
      try {
        await axios.post('/api/bookings', { resourceId: selectedSystem._id });
        await fetchSystems();
        setSelectedSystem(null);
      } catch (err) {
        setError('Failed to book the system. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <h2>Book a System</h2>
      <select onChange={e => setSelectedLayout(e.target.value)}>
        <option value="standard">Standard Layout</option>
        <option value="lShape">L-Shape Layout</option>
      </select>
      <LabLayout 
        layout={selectedLayout} 
        computers={systems} 
        onSelect={handleSystemSelect}
      />
      {selectedSystem && (
        <button onClick={bookSystem}>Book {selectedSystem.name}</button>
      )}
    </div>
  );
};

export default VisualBooking;