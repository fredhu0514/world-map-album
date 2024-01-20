import React, { useEffect, useState } from 'react';
import { useMap } from "react-leaflet";
import { calculateScreenPosition } from "@/utils/calculateScreenPosition";

const LineDrawer = ({ linePairs }) => {
    const map = useMap();
    const [updatedLinePairs, setUpdatedLinePairs] = useState([]);

    useEffect(() => {
        const updateLines = () => {
            const newLinePairs = linePairs.map((pair) => {
                return {
                    ...pair,
                    mapPinPosition: calculateScreenPosition(
                        pair.mapPin,
                        map
                    ),
                    fixedPinPosition: calculateScreenPosition(
                        pair.fixedPin,
                        map
                    ),
                };
            });

            // 确保所有位置都已计算
            if (
                newLinePairs.every(
                    (pair) => pair.mapPinPosition && pair.fixedPinPosition
                )
            ) {
                setUpdatedLinePairs(newLinePairs);
            }
        };

        map.on("move", updateLines);
        map.on("zoom", updateLines);

        // 初始更新
        updateLines();

        return () => {
            map.off("move", updateLines);
            map.off("zoom", updateLines);
        };
    }, [map, linePairs]);

    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                zIndex: 1000,
                pointerEvents: "none",
            }}
        >
            {updatedLinePairs.map((pair, index) => (
                <line
                    key={index}
                    x1={pair.mapPinPosition?.x}
                    y1={pair.mapPinPosition?.y}
                    x2={pair.fixedPinPosition?.x}
                    y2={pair.fixedPinPosition?.y}
                    stroke="#9E1030"
                    strokeWidth="2"
                />
            ))}
        </svg>
    );
};

export default React.memo(LineDrawer);