import React, { useState, useEffect, useRef, useCallback } from "react";

import { FixedContainer } from "@/components/FixedContainer/FixedContainer";
import { FoldablePanel } from "@/components/FoldablePanel/FoldablePanel";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { LongitudeAdjustButtons } from "@/components/LongitudeAdjustButtons/LongitudeAdjustButtons";
import { SearchResultTemporaryPin } from "@/components/SearchResultTemporaryMarker/SearchResultTemporaryMarker";

import { addNewPin } from "@/utils/pins/addNewPin";
import { deletePin } from "@/utils/pins/deletePin";
import { updateLines } from "@/utils/lines/updateLines";
import { geoCodeLocation } from "@/utils/openStreetMap/geoCodeLocation";

import LineDrawer from "@/hooks/lineDrawer";
import useKeyPress from "@/hooks/useKeyPress";
import useDragEvents from "@/hooks/useDragEvents";
import useFetchPinsAndLines from "@/hooks/useFetchPinsAndLines";
import useDragEventListeners from "@/hooks/useDragEventListeners";

import {
    keyPress,
    keyRelease,
    searchLocation,
    adjustLongitude,
    resetLocation,
    keyMap,
    markerClick,
    addTemporaryPinPermanently,
    onDragStart,
} from "@/eventHandlers/eventHandlers";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "@/components/MapComponent/MapComponent.module.css";

const INITIAL_MAP_CENTER = {
    lat: 38,
    lng: -95.0,
    zoomLevel: 5,
};

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

    const [searchedLocation, setSearchedLocation] =
        useState(INITIAL_MAP_CENTER);

    const [originalLng, setOriginalLng] = useState(INITIAL_MAP_CENTER.lng);

    const [temporaryPin, setTemporaryPin] = useState(null);

    // 在地图相关的部分，根据 searchedLocation 添加标记
    useEffect(() => {
        if (searchedLocation) {
            // 添加一个标记到地图上
            // 例如使用 L.marker
            console.log("Searched Location: ", searchedLocation);
        }
    }, [searchedLocation]);

    const handleSearch = async (searchTerm) => {
        searchLocation(
            searchTerm,
            geoCodeLocation,
            setSearchedLocation,
            setOriginalLng,
            setTemporaryPin,
            mapRef
        );
    };

    // Event handler to adjust longitude
    const handleAdjustLongitude = (adjustment) => {
        adjustLongitude(
            adjustment,
            searchedLocation,
            mapRef,
            setSearchedLocation,
            temporaryPin,
            setTemporaryPin
        );
    };

    // Event handler to reset to original location
    const handleResetLocation = () => {
        resetLocation(
            searchedLocation,
            originalLng,
            mapRef,
            setSearchedLocation,
            temporaryPin,
            setTemporaryPin
        );
    };

    const handleKeyRelease = (key) => {
        keyRelease(key, setSelectedMapPin, setSelectedFixedPin);
    };

    const handleKeyPress = (key) => {
        keyPress(key);
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

    const handleAddTemporaryPin = () =>
        addTemporaryPinPermanently(
            temporaryPin,
            handleAddNewPin,
            setTemporaryPin
        );

    // Function to remove temporary pin
    const removeTemporaryPin = () => {
        setTemporaryPin(null);
    };

    /*
        Use Effects
    */

    // Use isMKeyPressed to modify the dragging state
    useDragEvents(
        setFixedMarkers,
        setLinePairs,
        draggingFixedPin,
        setDraggingFixedPin,
        originalPosition,
        setOriginalPosition,
        isMKeyPressed,
        setIsMKeyPressed
    );

    // Keep track of the markers
    useFetchPinsAndLines(setMarkers, setFixedMarkers, setLinePairs);

    /*
        Event Handlers 
    */

    const handleMarkerClick = (marker) => {
        markerClick(
            marker,
            isCKeyPressed,
            selectedMapPin,
            selectedFixedPin,
            setLinePairs,
            linePairs,
            setSelectedMapPin,
            setSelectedFixedPin
        );
    };

    // 使用 useCallback 来确保在组件的整个生命周期内 handleMouseMove 是同一个函数实例
    const handleMouseMove = useCallback(
        (e) => {
            if (draggingFixedPin) {
                // 只在拖拽状态下更新 mousePosition
                setMousePosition({ x: e.clientX, y: e.clientY });
                console.log("Dragging", draggingFixedPin);
                console.log("Mouse moved during dragging", mousePosition);

                // 更新与拖拽 pin 相关的线条
                updateLines(
                    setLinePairs,
                    draggingFixedPin,
                    e.clientX,
                    e.clientY
                );
            }
        },
        [draggingFixedPin]
    );

    // 在 useEffect 中添加和移除事件监听器
    useDragEventListeners(draggingFixedPin, handleMouseMove);

    // Used in FixedMarker component
    const handleDragStart = (e, marker) =>
        onDragStart(
            e,
            marker,
            isMKeyPressed,
            setOriginalPosition,
            setDraggingFixedPin
        );

    // Handler of useMapEvents
    const MapEvents = ({ onAddPin }) => {
        const map = useMap();
        useMapEvents({
            click(e) {
                onAddPin({
                    latlng: e.latlng,
                    mapInstance: map,
                }); // Pass both latlng and the map instance
            },
        });
    };

    /*
        APIs Called in Event Handlers
    */
    const handleAddNewPin = ({
        latlng,
        mapInstance = null,
        temporaryPinConversion = false,
    } = {}) => {
        addNewPin({
            latlng,
            mapInstance,
            temporaryPinConversion,
            isFKeyPressed,
            isPKeyPressed,
            setFixedMarkers,
            setMarkers,
        });
    };

    const handleDeletePin = async (pinToDelete) => {
        deletePin({
            pinToDelete,
            setMarkers,
            setLinePairs,
            setFixedMarkers,
        });
    };

    // HTML Renderings
    return (
        <div style={{ position: "relative" }}>
            <FoldablePanel>
                <SearchBar onSearch={handleSearch} />
                <LongitudeAdjustButtons
                    onAdjust={handleAdjustLongitude}
                    onReset={handleResetLocation}
                />
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
                <MapEvents onAddPin={handleAddNewPin} />
                <div>
                    {temporaryPin && (
                        <SearchResultTemporaryPin
                            position={temporaryPin}
                            onAdd={handleAddTemporaryPin}
                            onRemove={removeTemporaryPin}
                        />
                    )}
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
                                                handleDeletePin(marker);
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
                deletePin={handleDeletePin}
                isDeleteKeyPressed={isDeleteKeyPressed}
                handleDragStart={handleDragStart}
                draggingFixedPin={draggingFixedPin}
                mousePosition={mousePosition}
            />
        </div>
    );
};

export default MapComponent;
