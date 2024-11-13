import React from 'react';
import styles from './Legend.module.css';
import { Circle } from 'lucide-react';

const Legend = () => {
  return (
    <div className={styles.legend}>
      {['available', 'booked', 'selected', 'current'].map((status) => (
        <div key={status} className={styles.legendItem}>
          <Circle className={`${styles.legendColor} ${styles[status]}`} size={16} />
          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;