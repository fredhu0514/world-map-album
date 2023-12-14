import React, { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isPKeyPressed, setIsPKeyPressed] = useState(false);
    const [isDeleteKeyPressed, setIsDeleteKeyPressed] = useState(false);

    useEffect(() => {
        getPins().then((data) => {
            setMarkers(data);
        });
    }, []);

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

    const addNewPin = async (newPin) => {
        fetch("http://localhost:3000/api/pins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPin }),
        })
            .then((response) => response.json())
            .then((addedPin) =>
                setMarkers((prevMarkers) => [...prevMarkers, addedPin])
            ) // Use addedPin from response
            .catch((error) =>
                console.error("[ERROR] Failed to add a new pin. Error: ", error)
            );
    };

    const deletePin = async (pinToDelete) => {
        console.log("DELETE", pinToDelete.id);
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
                    prevMarkers.filter((marker) => marker.id !== pinToDelete.id)
                )
            )
            .catch((error) =>
                console.error(
                    "[ERROR] Failed to delete the pin{",
                    pinToDelete.id,
                    "}. Error: :",
                    error
                )
            );
    };

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                if (isPKeyPressed) {
                    const newMarker = {
                        latlng: e.latlng,
                        id: Date.now(), // 使用时间戳作为唯一标识符
                    };
                    addNewPin(newMarker);
                }
            },
        });

        return null;
    };

    return (
        <MapContainer
            center={[38, -95.0]}
            zoom={5}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents />
            {markers?.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.latlng}
                    icon={selectedMarker === marker ? hoverIcon : normalIcon}
                    eventHandlers={{
                        click: () => setSelectedMarker(marker),
                        mouseover: () => setSelectedMarker(marker),
                        mouseout: () => setSelectedMarker(null),
                        dblclick: () => {
                            if (isDeleteKeyPressed) {
                                deletePin(marker);
                            }
                        }, // 双击删除图钉
                    }}
                >
                    {/* 弹出窗口逻辑（如果需要） */}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
