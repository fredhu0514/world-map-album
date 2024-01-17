import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { FixedContainer } from "@/components/FixedContainer/FixedContainer";
import { FoldablePanel } from "@/components/FoldablePanel/FoldablePanel";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { LongitudeAdjustButtons } from '@/components/LongitudeAdjustButtons/LongitudeAdjustButtons';
import { geoCodeLocation } from "@/utils/geoCodeLocation";
import { SearchResultTemporaryPin } from "@/components/SearchResultTemporaryMarker/SearchResultTemporaryMarker";
import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { useKeyPress } from "@/hooks/useKeyPress";
import "leaflet/dist/leaflet.css";

import styles from "@/components/MapComponent/MapComponent.module.css";

const INITIAL_MAP_CENTER= {
    lat: 38,
    lng: -95.0,
    zoomLevel: 5,
}

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

// Get All APIs
const fetchApi = async (url) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

const MapComponent = () => {
    const mapRef = useRef(null);

    const [markers, setMarkers] = useState([]);
    const [fixedMarkers, setFixedMarkers] = useState([]);

    const [selectedMarker, setSelectedMarker] = useState(null);

    const [selectedMapPin, setSelectedMapPin] = useState(null);
    const [selectedFixedPin, setSelectedFixedPin] = useState(null);
    const [linePairs, setLinePairs] = useState([]);

    const [isMKeyPressed, setIsMKeyPressed] = useState(false);
    const [draggingFixedPin, setDraggingFixedPin] = useState(null);
    const [originalPosition, setOriginalPosition] = useState(null);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [searchedLocation, setSearchedLocation] = useState(INITIAL_MAP_CENTER);

    const [originalLng, setOriginalLng] = useState(INITIAL_MAP_CENTER.lng);

    const [temporaryPin, setTemporaryPin] = useState(null);

    const handleKeyPress = (key) => {
        switch (key) {
            case "p":
                break;
            case "f":
                break;
            case "delete":
                break;
            case "c":
                break;
            default:
            // Other key actions
        }
    };

    const handleKeyRelease = (key) => {
        switch (key) {
            case "p":
                break;
            case "f":
                break;
            case "delete":
                break;
            case "c":
                setSelectedMapPin(null);
                setSelectedFixedPin(null);
                break;
            default:
            // Other key actions
        }
        // Other key release actions if needed
    };

    // 在地图相关的部分，根据 searchedLocation 添加标记
    useEffect(() => {
        if (searchedLocation) {
            // 添加一个标记到地图上
            // 例如使用 L.marker
            console.log('Searched Location: ', searchedLocation);
        }
    }, [searchedLocation]);

    const handleSearch = async (searchTerm) => {
        try {
            const result = await geoCodeLocation(searchTerm);
            setSearchedLocation(result);
            setOriginalLng(result.lng);
            setTemporaryPin([result.lat, result.lng]);
            console.log('Ref', mapRef);
            if (mapRef.current) {
                let zoomLevel;
                switch(result.type) {
                    case 'tertiary':
                        zoomLevel = 20;
                        break;
                    case 'landmark':
                        zoomLevel = 17;
                        break;
                    case 'research_institute':
                    case 'university':
                    case 'aerodrome': 
                    case 'park': 
                        zoomLevel = 16;
                        break;
                    case 'water':
                        zoomLevel = 13;
                        break;
                    case 'administrative':
                        zoomLevel = 12;
                        break;
                    case 'country':
                        zoomLevel = 5;
                        break;
                    default:
                        zoomLevel = 15; // default zoom level
                }
                mapRef.current.setView([result.lat, result.lng], zoomLevel);
            }
        } catch (error) {
            console.error('Error during location search:', error);
        }
    };

    // Event handler to adjust longitude
    const adjustLongitude = (adjustment) => {
        if (mapRef.current && searchedLocation) {
            const newLng = searchedLocation.lng + adjustment;
            mapRef.current.setView([searchedLocation.lat, newLng], mapRef.current.getZoom());
            setSearchedLocation({...searchedLocation, lng: newLng});
            if (temporaryPin) {
                setTemporaryPin([searchedLocation.lat, newLng]);
            }
        }
    }

    // Event handler to reset to original location
    const resetLocation = () => {
        if (mapRef.current && searchedLocation && originalLng !== null) {
            mapRef.current.setView([searchedLocation.lat, originalLng], mapRef.current.getZoom());
            setSearchedLocation({...searchedLocation, lng: originalLng});
            if (temporaryPin) {
                setTemporaryPin([searchedLocation.lat, originalLng]);
            }
        }
    }

    const keyMap = {
        d: "d",
        D: "d",
        c: "c",
        C: "c",
        f: "f",
        F: "f",
        d: "delete",
        D: "delete",
        backspace: "delete",
        Backspace: "delete",
        delete: "delete",
        Delete: "delete",
    };

    const keyStates = useKeyPress(
        ["p", "f", "delete", "c"],
        keyMap,
        handleKeyPress,
        handleKeyRelease
    );

    // Use keyStates directly
    const {
        p: isPKeyPressed,
        f: isFKeyPressed,
        c: isCKeyPressed,
        delete: isDeleteKeyPressed,
    } = keyStates;

    // Function to handle adding the temporary pin
    const addTemporaryPinPermanently = () => {
        // Logic to add the pin permanently
        // Clear temporary pin
        if (temporaryPin) {
            const latlng = { lat: temporaryPin[0], lng: temporaryPin[1] };
            // Call addNewPin with the correct latlng object
            addNewPin({
                latlng: { 
                    lat: temporaryPin[0], 
                    lng: temporaryPin[1] 
                }, 
                temporaryPinConversion: true
            });
        }
        setTemporaryPin(null);
    };

    // Function to remove temporary pin
    const removeTemporaryPin = () => {
        setTemporaryPin(null);
    };

    /*
        Use Effects
    */

    // Use isMKeyPressed to modify the dragging state
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
                        setLinePairs((prevLinePairs) =>
                            prevLinePairs.map((pair) => {
                                if (pair.fixedPin.id === draggingFixedPin.id) {
                                    return {
                                        ...pair,
                                        fixedPin: {
                                            ...pair.fixedPin,
                                            latlng: newLatlng,
                                        },
                                    };
                                }
                                return pair;
                            })
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

            // 停止追踪鼠标移动
            window.removeEventListener("mousemove", handleMouseMove);
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

    // Keep track of the markers
    useEffect(() => {
        const fetchPinsAndLines = async () => {
            try {
                // Fetch and set pins
                const receivedMarkers = await fetchApi(
                    "http://localhost:3000/api/pins"
                );
                const mapPins = receivedMarkers.filter(
                    (marker) => marker.type === "map"
                );
                const fixedPins = receivedMarkers.filter(
                    (marker) => marker.type === "fixed"
                );

                setMarkers(mapPins);
                setFixedMarkers(fixedPins);

                // Fetch and process lines
                const receivedLines = await fetchApi(
                    "http://localhost:3000/api/lines"
                );
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

    /*
        Event Handlers 
    */

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

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Used in FixedMarker component
    const handleDragStart = (e, marker) => {
        e.preventDefault();
        if (isMKeyPressed && !draggingFixedPin) {
            console.log("Rly manipulating it now.");
            setOriginalPosition(marker.latlng);
            setDraggingFixedPin(marker);
        }
        window.addEventListener("mousemove", handleMouseMove);
    };

    // Handler of useMapEvents
    const MapEvents = ({ onAddPin }) => {
        const map = useMap();
        useMapEvents({
            click(e) {
                onAddPin({
                    latlng: e.latlng, 
                    mapInstance: map
                }); // Pass both latlng and the map instance
            },
        });
    };

    /*
        Renderings
    */
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

    /*
        APIs Called in Event Handlers
    */
    const addNewPin = ({ latlng, mapInstance = null, temporaryPinConversion = false } = {}) => {
        const newPin = {
            latlng,
            id: Date.now(),
        };

        if (isFKeyPressed && mapInstance) {
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
        } else if (isPKeyPressed || temporaryPinConversion) {
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

    // HTML Renderings
    return (
        <div style={{ position: "relative" }}>
            <FoldablePanel>
                <SearchBar onSearch={handleSearch} />
                <LongitudeAdjustButtons onAdjust={adjustLongitude} onReset={resetLocation} />
            </FoldablePanel>
            <MapContainer
                ref={(ref) => { 
                    if (ref) mapRef.current = ref; 
                }}
                center={[INITIAL_MAP_CENTER.lat, INITIAL_MAP_CENTER.lng]}
                zoom={INITIAL_MAP_CENTER.zoomLevel}
                className={styles.mapContainer}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEvents onAddPin={addNewPin} />
                <div>
                    {
                        temporaryPin && (
                            <SearchResultTemporaryPin
                                position={temporaryPin}
                                onAdd={addTemporaryPinPermanently}
                                onRemove={removeTemporaryPin}
                            />
                        )
                    }
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
                handleDragStart={handleDragStart}
                draggingFixedPin={draggingFixedPin}
                mousePosition={mousePosition}
            />
        </div>
    );
};

export default MapComponent;
