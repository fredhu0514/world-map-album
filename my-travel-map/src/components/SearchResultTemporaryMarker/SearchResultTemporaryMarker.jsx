import React, { useState, useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { SearchResultTemporaryPinPopup } from '@/components/SearchResultTemporaryPinPopup/SearchResultTemporaryPinPopup';
import "leaflet/dist/leaflet.css";

const normalIcon = new L.Icon({
    iconUrl: "/search-result-temporary-marker.png",
    shadowUrl: null,
    iconSize: [41, 41],
    iconAnchor: [10, 35], // Center the icon over the position
});

const hoverIcon = new L.Icon({
    iconUrl: "/search-result-temporary-marker-hover.png",
    shadowUrl: null,
    iconSize: [61.5, 61.5],
    iconAnchor: [15, 52.5], // Center the hover icon over the position
});

export const SearchResultTemporaryPin = ({ position, onAdd, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const markerRef = useRef(null); // Add this line

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup(); // Open the popup as soon as the marker is mounted
        }
    }, [position]);

    const handleMouseOver = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);

    const handleAdd = () => {
        setShowPopup(false);
        onAdd();
    };

    const handleClose = () => {
        setShowPopup(false);
        onRemove();
    };

    return (
        <Marker 
            ref={markerRef} // Add the ref here
            position={position} 
            icon={isHovered ? hoverIcon : normalIcon}
            eventHandlers={{
                mouseover: handleMouseOver,
                mouseout: handleMouseOut
            }}
        >
            {
                showPopup && 
                <SearchResultTemporaryPinPopup 
                    position={position} 
                    onAdd={handleAdd} 
                    onClose={handleClose} 
                />
            }
        </Marker>
    );
};