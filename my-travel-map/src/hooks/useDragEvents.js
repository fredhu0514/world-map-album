import { useEffect } from "react";
import { updateLines } from "@/utils/lines/updateLines";

const useDragEvents = (
    setFixedMarkers,
    setLinePairs,
    draggingFixedPin,
    setDraggingFixedPin,
    originalPosition,
    setOriginalPosition,
    isMKeyPressed,
    setIsMKeyPressed
) => {
    useEffect(() => {
        // 键盘按下事件处理器
        const handleKeyDown = (e) => {
            if (e.key === "m" || e.key === "M") {
                setIsMKeyPressed(true);
            }
        };

        // 键盘释放事件处理器
        const handleKeyUp = (e) => {
            if (e.key === "m" || e.key === "M") {
                setIsMKeyPressed(false);
                if (draggingFixedPin) {
                    console.log("Reset the fixed pin location.");
                    // 如果松开 'm' 键，则重置 fixed pin 的位置
                    setFixedMarkers((prevMarkers) =>
                        prevMarkers.map((marker) =>
                            marker.id === draggingFixedPin.id
                                ? { ...marker, latlng: originalPosition }
                                : marker
                        )
                    );
                    // 同时重置相关线条到原始位置
                    updateLines(
                        setLinePairs,
                        draggingFixedPin,
                        originalPosition.lat,
                        originalPosition.lng
                    );
                    setDraggingFixedPin(null);
                    setOriginalPosition(null);
                }
            }
        };

        // 全局鼠标抬起事件处理器
        const handleGlobalMouseUp = (e) => {
            if (draggingFixedPin) {
                // 拖拽结束时的逻辑
                const newLatlng = {
                    lat: e.clientX,
                    lng: e.clientY,
                };

                // Backend-related code
                fetch("http://localhost:3000/api/pins", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pin: {
                            id: draggingFixedPin.id,
                            latlng: newLatlng,
                            type: "fixed",
                        },
                    }),
                })
                    .then((response) => response.json())
                    .then(() => {
                        // 更新 fixed pin 位置
                        setFixedMarkers((prevMarkers) =>
                            prevMarkers.map((m) =>
                                m.id === draggingFixedPin.id
                                    ? { ...m, latlng: newLatlng }
                                    : m
                            )
                        );
                    })
                    .then(() => {
                        // 更新与该 fixed pin 相关联的线的位置
                        updateLines(
                            setLinePairs,
                            draggingFixedPin,
                            newLatlng.lat,
                            newLatlng.lng
                        );
                    })
                    .catch((error) =>
                        console.error(
                            "[ERROR] Failed to update the pin{",
                            draggingFixedPin.id,
                            "}. Error: :",
                            error
                        )
                    );

                // 重置拖拽状态
                setDraggingFixedPin(null);
                setOriginalPosition(null);
            }
        };

        // 添加键盘事件监听器
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // 添加全局鼠标抬起事件监听器（如果有拖拽进行中）
        if (draggingFixedPin) {
            window.addEventListener("mouseup", handleGlobalMouseUp);
        }

        // 清理函数：移除事件监听器
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, [draggingFixedPin, originalPosition, isMKeyPressed]);
};

export default useDragEvents;
