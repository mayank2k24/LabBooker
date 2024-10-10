// src/components/bookings/VisualBooking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VisualBooking.module.css';
import { classroomLayouts } from './classroomLayouts';
import CalendarView from './CalendarView';
import Legend from './Legend';
import { format } from 'date-fns';

const VisualBooking = () => {
  const [selectedClassroom, setSelectedClassroom] = useState('CVR-215');
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    date: new Date(),
    startTime: '',
    endTime: '',
    classroom: ''
  });
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    initializeSeats(selectedClassroom);
    fetchBookings();
  }, [selectedClassroom, bookingInfo.date]);

  const initializeSeats = (classroomId) => {
    const layout = classroomLayouts[classroomId];
    const totalSeats = layout.rows * layout.seatsPerRow;
    const initialSeats = Array(totalSeats).fill().map((_, index) => ({
      id: `${classroomId}-${index + 1}`,
      isBooked: false,
      bookingDetails: null
    }));
    setSeats(initialSeats);
    setBookingInfo(prev => ({ ...prev, classroom: classroomId }));
  };

  const fetchBookings = async () => {
    try {
      const formattedDate = format(bookingInfo.date, 'yyyy-MM-dd');
      const res = await axios.get(`/api/savera/bookings?classroom=${selectedClassroom}&date=${formattedDate}`);
      updateSeatStatus(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const updateSeatStatus = (bookings) => {
    const updatedSeats = seats.map(seat => {
      const booking = bookings.find(b => b.seat === seat.id);
      return {
        ...seat,
        isBooked: !!booking,
        bookingDetails: booking
      };
    });
    setSeats(updatedSeats);
  };

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId);
  };

  const handleBooking = async () => {
    if (!selectedSeat) return;

    try {
      await axios.post('/api/savera/bookings', {
        ...bookingInfo,
        seat: selectedSeat,
        date: format(bookingInfo.date, 'yyyy-MM-dd')
      });
      fetchBookings();
      setSelectedSeat(null);
    } catch (error) {
      console.error('Error booking seat:', error);
    }
  };

  const handleDateChange = (date) => {
    setBookingInfo(prev => ({ ...prev, date }));
  };

  const isCurrentTimeSlot = (seat) => {
    if (!seat.bookingDetails) return false;
    const now = new Date();
    const startTime = new Date(now.toDateString() + ' ' + seat.bookingDetails.startTime);
    const endTime = new Date(now.toDateString() + ' ' + seat.bookingDetails.endTime);
    return now >= startTime && now <= endTime;
  };

  const renderSeat = (seat, index) => {
    const isBooked = seat.isBooked;
    const isCurrent = isCurrentTimeSlot(seat);
    const isSelected = selectedSeat === seat.id;

    return (
      <div 
        key={seat.id}
        className={`${styles.seat} 
                    ${isBooked ? styles.booked : ''} 
                    ${isSelected ? styles.selected : ''} 
                    ${isCurrent ? styles.current : ''}`}
        onClick={() => !isBooked && handleSeatClick(seat.id)}
        onMouseEnter={() => setHoveredSeat(seat)}
        onMouseLeave={() => setHoveredSeat(null)}
      >
        <span className={styles.computerIcon}>💻</span>
        {hoveredSeat === seat && seat.bookingDetails && (
          <div className={styles.tooltip}>
            <p>Booked: {seat.bookingDetails.startTime} - {seat.bookingDetails.endTime}</p>
          </div>
        )}
      </div>
    );
  };

  const layout = classroomLayouts[selectedClassroom];

  
  return (
    <div className={styles.visualBooking}>
      <h2>Visual Booking</h2>
      <div className={styles.controlPanel}>
        <select 
          value={selectedClassroom} 
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          {Object.keys(classroomLayouts).map(classroomId => (
            <option key={classroomId} value={classroomId}>
              {classroomLayouts[classroomId].name}
            </option>
          ))}
        </select>
        <CalendarView selectedDate={bookingInfo.date} onDateChange={handleDateChange} />
        <div className={styles.timeInputs}>
          <input 
            type="time" 
            value={bookingInfo.startTime} 
            onChange={(e) => setBookingInfo({...bookingInfo, startTime: e.target.value})}
          />
          <input 
            type="time" 
            value={bookingInfo.endTime} 
            onChange={(e) => setBookingInfo({...bookingInfo, endTime: e.target.value})}
          />
        </div>
        <button onClick={handleBooking} disabled={!selectedSeat}>Book Selected Seat</button>
      </div>
      <div className={styles.roomLayout}>
        <div className={`${styles.door} ${styles[layout.doorPosition]}`}>
          <span className={styles.doorIcon}>🚪</span>
        </div>
        <div className={`${styles.teacherDesk} ${styles[layout.teacherDeskPosition]}`}>
          <span className={styles.teacherDeskIcon}>👩‍🏫</span>
        </div>
        <div className={styles.seatsContainer} style={{
          gridTemplateColumns: `repeat(${layout.seatsPerRow}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 1fr)`
        }}>
          {seats.map(renderSeat)}
        </div>
        {layout.tables.map((table, index) => (
          <div 
            key={index} 
            className={styles.table} 
            style={{
              gridColumn: `${table.startCol} / span ${table.width}`,
              gridRow: `${table.startRow} / span ${table.height}`
            }}
          >
            <span className={styles.tableIcon}>📊</span>
          </div>
        ))}
      </div>
      <Legend />
    </div>
  );
};

export default VisualBooking;

