import React, { useState, useEffect } from 'react';
import styles from './UndoFooter.module.css';

const UndoFooter = ({ message, onUndo, onClose, duration = 5000 }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  return (
    <div className={styles.undoFooter}>
      <p className={styles.message}>{message}</p>
      <div className={styles.countdownWrapper}>
        <span className={styles.countdown}>{timeLeft}</span>
        <button className={styles.undoButton} onClick={() => onUndo(true)}>Undo</button>
      </div>
    </div>
  );
};

export default UndoFooter;