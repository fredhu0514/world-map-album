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

import styles from '@/components/MapComponent/MapComponent.module.css';

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
    console.log("[INFO] GET IN RENDERING");
    const res = await fetch("http://localhost:3000/api/pins", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }
    console.log("[INFO] GET IN RENDERING OUT");

    return res.json();
};

const MapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [fixedMarkers, setFixedMarkers] = useState([]); // 新增状态：存储视窗中的 fixed pins

    const [selectedMarker, setSelectedMarker] = useState(null);

    const [isPKeyPressed, setIsPKeyPressed] = useState(false);
    const [isFKeyPressed, setIsFKeyPressed] = useState(false); // 新增状态：是否按下 'f' 键
    const [isDeleteKeyPressed, setIsDeleteKeyPressed] = useState(false);

    // Keep track of the markers
    useEffect(() => {
        getPins().then((receivedMarkers) => {
            const mapPins = receivedMarkers.filter(
                (marker) => marker.type === "map"
            );
            const fixedPins = receivedMarkers.filter(
                (marker) => marker.type === "fixed"
            );

            setMarkers(mapPins);
            setFixedMarkers(fixedPins);
        });
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
                        (marker) => marker.type !== "fixed" && (
                            <Marker
                                key={marker.id}
                                position={marker.latlng}
                                icon={
                                    selectedMarker === marker
                                        ? hoverIcon
                                        : normalIcon
                                }
                                eventHandlers={{
                                    click: () => setSelectedMarker(marker),
                                    mouseover: () => setSelectedMarker(marker),
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
            </MapContainer>
            <FixedContainer
                fixedMarkers={fixedMarkers}
                selectedMarker={selectedMarker}
                setSelectedMarker={setSelectedMarker}
                deletePin={deletePin}
                isDeleteKeyPressed={isDeleteKeyPressed}
            />
        </div>
    );
};

export default MapComponent;
