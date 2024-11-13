import React from 'react';
import { Monitor, LampDesk, DoorOpen } from 'lucide-react';
import styles from './LabLayout.module.css';

const LabLayout = ({ layout, seats, selectedSeat, onSeatClick }) => {
  return (
    <div className={styles.labLayout} style={{
      gridTemplateColumns: `repeat(${layout.seatArrangement[0].length}, 1fr)`,
      gridTemplateRows: `repeat(${layout.seatArrangement.length}, 1fr)`
    }}>
      {layout.seatArrangement.flatMap((row, rowIndex) => 
        row.map((seatNumber, colIndex) => {
          if (seatNumber === null) {
            if (layout.teacherDesk && layout.teacherDesk.row === rowIndex && layout.teacherDesk.col === colIndex) {
              return (
                <div key={`teacher-${rowIndex}-${colIndex}`} className={styles.teacherDesk}>
                  <LampDesk size={24} />
                  <span>Teacher</span>
                </div>
              );
            }
            if (layout.door && layout.door.row === rowIndex && layout.door.col === colIndex) {
              return (
                <div key={`door-${rowIndex}-${colIndex}`} className={styles.door}>
                  <DoorOpen size={24} />
                  <span>Door</span>
                </div>
              );
            }
            return <div key={`empty-${rowIndex}-${colIndex}`} className={styles.emptySeat} />;
          }
          const seat = seats.find(s => s.number === seatNumber) || { id: `${layout.name}-${seatNumber}`, number: seatNumber, status: 'available' };
          return (
            <div
              key={seat.id}
              className={`${styles.seat} ${styles[seat.status]} ${selectedSeat === seat.id ? styles.selected : ''}`}
              onClick={() => onSeatClick(seat.id)}
            >
              <Monitor size={24} />
              <span>{seat.number}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LabLayout;