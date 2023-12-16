import React, { useState, useEffect } from "react";
import L from "leaflet";
import { FixedContainer } from "@/components/FixedContainer/FixedContainer";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "@/components/MapComponent/MapComponent.module.css";

const normalIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: null,
    iconSize: [41, 41],
    iconAnchor: [10, 35],
});

const hoverIcon = new L.Icon({
    iconUrl: "/marker-icon-hover.png", // 选中状态的图标
    shadowUrl: null,
    iconSize: [61.5, 61.5],
    iconAnchor: [15, 52.5],
});

const getPins = async () => {
    console.log("[INFO] GET PINS IN RENDERING");
    const res = await fetch("http://localhost:3000/api/pins", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }
    console.log("[INFO] GET PINS IN RENDERING OUT");

    return res.json();
};

const getLines = async () => {
    console.log("[INFO] GET LINEs IN RENDERING");
    const res = await fetch("http://localhost:3000/api/lines", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }
    console.log("[INFO] GET LINES IN RENDERING OUT");

    return res.json();
};

const MapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [fixedMarkers, setFixedMarkers] = useState([]);

    const [selectedMarker, setSelectedMarker] = useState(null);

    const [isPKeyPressed, setIsPKeyPressed] = useState(false);
    const [isFKeyPressed, setIsFKeyPressed] = useState(false);
    const [isCKeyPressed, setIsCKeyPressed] = useState(false);
    const [isDeleteKeyPressed, setIsDeleteKeyPressed] = useState(false);

    const [selectedMapPin, setSelectedMapPin] = useState(null);
    const [selectedFixedPin, setSelectedFixedPin] = useState(null);
    const [linePairs, setLinePairs] = useState([]);

    // Keep track of the markers
    useEffect(() => {
        const fetchPinsAndLines = async () => {
            try {
                // Fetch and set pins
                const receivedMarkers = await getPins();
                const mapPins = receivedMarkers.filter(
                    (marker) => marker.type === "map"
                );
                const fixedPins = receivedMarkers.filter(
                    (marker) => marker.type === "fixed"
                );

                setMarkers(mapPins);
                setFixedMarkers(fixedPins);

                // Fetch and process lines
                const receivedLines = await getLines();
                const lines = receivedLines.map((line) => {
                    return {
                        mapPin: mapPins.find(
                            (marker) => marker.id === line.map_pin_id
                        ),
                        fixedPin: fixedPins.find(
                            (marker) => marker.id === line.fixed_pin_id
                        ),
                    };
                });
                setLinePairs(lines);
            } catch (error) {
                console.error("Error fetching pins and lines: ", error);
            }
        };

        fetchPinsAndLines();
    }, []);

    // "P" key event handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "p" || e.key === "P") {
                setIsPKeyPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "p" || e.key === "P") {
                setIsPKeyPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // "F" key event handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "f" || e.key === "F") {
                setIsFKeyPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "f" || e.key === "F") {
                setIsFKeyPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // "D" & "Delete" key event handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "d" || e.key === "D" || e.key === "Delete") {
                setIsDeleteKeyPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "d" || e.key === "D" || e.key === "Delete") {
                setIsDeleteKeyPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // "C" key event handler (for connect map pin & fixed pin)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "c" || e.key === "C") {
                setIsCKeyPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "c" || e.key === "C") {
                setIsCKeyPressed(false);
                // 重置 selectedMapPin 和 selectedFixedPin
                setSelectedMapPin(null);
                setSelectedFixedPin(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const handleMarkerClick = (marker) => {
        if (!isCKeyPressed) return;

        if (marker.type === "map") {
            setSelectedMapPin(marker);
        } else if (marker.type === "fixed") {
            setSelectedFixedPin(marker);
        }

        if (selectedMapPin && selectedFixedPin) {
            // Add line to backend and update frontend
            fetch("http://localhost:3000/api/lines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newLine: {
                        mapPinId: selectedMapPin.id,
                        fixedPinId: selectedFixedPin.id,
                    },
                }),
            })
                .then((response) => response.json())
                .then((addedLine) => {
                    setLinePairs([
                        ...linePairs,
                        {
                            mapPin: selectedMapPin,
                            fixedPin: selectedFixedPin,
                        },
                    ]);
                })
                .catch((error) =>
                    console.error(
                        "[ERROR] Failed to add a new line. Error: ",
                        error
                    )
                );

            setSelectedMapPin(null);
            setSelectedFixedPin(null);
        }
    };

    const calculateScreenPosition = (pin, mapInstance) => {
        if (pin.type === "map") {
            const point = mapInstance.latLngToContainerPoint(pin.latlng);
            return point;
        } else if (pin.type === "fixed") {
            // fixed pin 的 latlng 已经是屏幕坐标
            return { x: pin.latlng.lat, y: pin.latlng.lng };
        } else {
            throw new Error(
                "Unknown pin type, cannot calculate screen position."
            );
        }
    };

    const addNewPin = (latlng, mapInstance) => {
        const newPin = {
            latlng,
            id: Date.now(),
        };

        if (isFKeyPressed) {
            // Use mapInstance to calculate pixel position
            const point = mapInstance.latLngToContainerPoint(latlng);
            // Add the fixed pin to the fixedMarkers array
            const newFixedPin = {
                latlng: {
                    lat: point.x,
                    lng: point.y,
                },
                id: newPin.id,
                type: "fixed",
            };

            fetch("http://localhost:3000/api/pins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPin: newFixedPin }),
            })
                .then((response) => response.json())
                .then((addedPin) =>
                    setFixedMarkers((prevFixedMarkers) => [
                        ...prevFixedMarkers,
                        addedPin,
                    ])
                )
                .catch((error) =>
                    console.error(
                        "[ERROR] Failed to add a new fixed pin. Error: ",
                        error
                    )
                );
        } else if (isPKeyPressed) {
            const newMapPin = { ...newPin, type: "map" };
            fetch("http://localhost:3000/api/pins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPin: newMapPin }),
            })
                .then((response) => response.json())
                .then((addedPin) =>
                    setMarkers((prevMarkers) => [...prevMarkers, addedPin])
                )
                .catch((error) =>
                    console.error(
                        "[ERROR] Failed to add a new map pin. Error: ",
                        error
                    )
                );
        }
    };

    const deletePin = async (pinToDelete) => {
        console.log("[INFO] DELETE", pinToDelete.id, pinToDelete.type);
        if (pinToDelete.type === "map") {
            // 删除端点并更新连线
            setMarkers((prevMarkers) =>
                prevMarkers.filter((marker) => marker.id !== pinToDelete.id)
            );
            setLinePairs((prevPairs) =>
                prevPairs.filter((pair) => pair.mapPin.id !== pinToDelete.id)
            );
            // Backend-related code
            fetch("http://localhost:3000/api/pins", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pinId: pinToDelete.id }),
            })
                .then((response) => response.json())
                .then(() =>
                    setMarkers((prevMarkers) =>
                        prevMarkers.filter(
                            (marker) => marker.id !== pinToDelete.id
                        )
                    )
                )
                .then(() => {
                    setLinePairs(
                        linePairs.filter(
                            (pair) =>
                                pair.mapPin.id !== pinToDelete.id &&
                                pair.fixedPin.id !== pinToDelete.id
                        )
                    );
                })
                .catch((error) =>
                    console.error(
                        "[ERROR] Failed to delete the pin{",
                        pinToDelete.id,
                        pinToDelete.type,
                        "}. Error: :",
                        error
                    )
                );
        } else if (pinToDelete.type === "fixed") {
            // 删除端点并更新连线
            setFixedMarkers((prevMarkers) =>
                prevMarkers.filter((marker) => marker.id !== pinToDelete.id)
            );
            setLinePairs((prevPairs) =>
                prevPairs.filter((pair) => pair.fixedPin.id !== pinToDelete.id)
            );
            // Backend-related code
            fetch("http://localhost:3000/api/pins", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pinId: pinToDelete.id }),
            })
                .then((response) => response.json())
                .then(() =>
                    setFixedMarkers((prevMarkers) =>
                        prevMarkers.filter(
                            (marker) => marker.id !== pinToDelete.id
                        )
                    )
                )
                .catch((error) =>
                    console.error(
                        "[ERROR] Failed to delete the pin{",
                        pinToDelete.id,
                        pinToDelete.type,
                        "}. Error: :",
                        error
                    )
                );
        } else {
            console.log("[ERROR] Cannot delete this one on backend.");
        }
    };

    const MapEvents = ({ onAddPin }) => {
        const map = useMap();
        useMapEvents({
            click(e) {
                onAddPin(e.latlng, map); // Pass both latlng and the map instance
            },
        });
    };

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

    return (
        <div style={{ position: "relative" }}>
            <MapContainer
                center={[38, -95.0]}
                zoom={5}
                className={styles.mapContainer}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEvents onAddPin={addNewPin} />
                <div>
                    {markers.map(
                        (marker) =>
                            marker.type !== "fixed" && (
                                <Marker
                                    key={marker.id}
                                    position={marker.latlng}
                                    icon={
                                        selectedMarker === marker
                                            ? hoverIcon
                                            : normalIcon
                                    }
                                    eventHandlers={{
                                        click: () => {
                                            handleMarkerClick(marker);
                                            setSelectedMarker(marker);
                                        },
                                        mouseover: () =>
                                            setSelectedMarker(marker),
                                        mouseout: () => setSelectedMarker(null),
                                        dblclick: () => {
                                            if (isDeleteKeyPressed) {
                                                deletePin(marker);
                                            }
                                        },
                                    }}
                                />
                            )
                    )}
                </div>
                <LineDrawer linePairs={linePairs} />
                {/* 其他 Marker 和 TileLayer 组件 */}
            </MapContainer>
            <FixedContainer
                fixedMarkers={fixedMarkers}
                selectedMarker={selectedMarker}
                handleMarkerClick={handleMarkerClick}
                setSelectedMarker={setSelectedMarker}
                deletePin={deletePin}
                isDeleteKeyPressed={isDeleteKeyPressed}
            />
        </div>
    );
};

export default MapComponent;
