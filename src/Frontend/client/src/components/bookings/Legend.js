import React from 'react';
import styles from './Legend.module.css';

const Legend = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.available}`}></div>
        <span>Available</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.booked}`}></div>
        <span>Booked</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.selected}`}></div>
        <span>Selected</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendColor} ${styles.current}`}></div>
        <span>Current Time Slot</span>
      </div>
    </div>
  );
};

export default Legend;