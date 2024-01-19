import React, { useState, useEffect } from "react";
import { AuthLinks } from "@/components/AuthLinks/AuthLinks";
import styles from "./FoldablePanel.module.css";

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

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isOpen]);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        setShowButton(true);
    };

    return (
        <div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
            <button
                onClick={togglePanel}
                className={`${styles.button} ${showButton ? styles.show : ""}`}
                style={{ right: isOpen ? "33%" : "0px" }} // 动态样式
            >
                {isOpen ? "→" : "←"}
            </button>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <h1 className={`${styles.title} ${!isOpen ? styles.titleHidden : ''}`}>
                        World Map Album
                    </h1>
                </div>
                <div className={styles.authContainer}>
                    {/* Your AuthLinks or login button component here */}
                    <AuthLinks />
                </div>
            </div>

            {isOpen && <div className={styles.content}>{children}</div>}
        </div>
    );
};
