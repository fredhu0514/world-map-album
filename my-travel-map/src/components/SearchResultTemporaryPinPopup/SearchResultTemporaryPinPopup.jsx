import React from 'react';
import { Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";


export const SearchResultTemporaryPinPopup = ({ position, onAdd, onClose }) => {
    return (
        <Popup 
            position={position} 
            offset={[15, -25]} // Shifts the popup 20 pixels up
            closeButton={false} 
            autoPan={false} 
            style={{ zIndex: 1000 }}
        >
            <div style={{ textAlign: 'center' }}>
                <p>Do you want to add this Map Pin?</p>
                <button 
                    onClick={onAdd} 
                    style={{
                        backgroundColor: 'green', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        cursor: 'pointer' 
                    }}
                >
                    ✔
                </button>
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute', 
                        top: 5, 
                        left: 5, 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer' 
                    }}
                >
                    ✖
                </button>
            </div>
        </Popup>
    );
};
