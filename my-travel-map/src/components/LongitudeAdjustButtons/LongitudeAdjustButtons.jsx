import React from 'react';
import styles from './LongitudeAdjustButtons.module.css';

export const LongitudeAdjustButtons = ({ onAdjust, onReset }) => {
    return (
        <div className={styles.buttonContainer}>
            <button onClick={() => onAdjust(-360)} className={styles.adjustButton}>◄</button>
            <button onClick={onReset} className={styles.homeButton}>Home</button>
            <button onClick={() => onAdjust(360)} className={styles.adjustButton}>►</button>
        </div>
    );
};
