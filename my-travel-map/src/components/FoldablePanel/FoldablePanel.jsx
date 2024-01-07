import React, { useState, useEffect } from 'react';
import styles from './FoldablePanel.module.css';

export const FoldablePanel = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isOpen) {
                setShowButton(true);
                return;
            }
            const shouldShowButton = e.clientX > window.innerWidth * 0.8;
            setShowButton(shouldShowButton);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isOpen]);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        setShowButton(true);
    };

    return (
        <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
            <button 
                onClick={togglePanel} 
                className={`${styles.button} ${showButton ? styles.show : ''}`}
                style={{ right: isOpen ? '33%' : '0px' }} // 动态样式
            >
                {isOpen ? '→' : '←'}
            </button>
            {isOpen && <div className={styles.content}>{children}</div>}
        </div>
    );
};
