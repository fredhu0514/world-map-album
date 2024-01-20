import { useEffect } from "react";

const useDragEventListeners = (draggingFixedPin, handleMouseMove) => {
    useEffect(() => {
        if (draggingFixedPin) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (draggingFixedPin) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, [draggingFixedPin, handleMouseMove]);
};

export default useDragEventListeners;
