// components/FixedContainer/FixedContainer.jsx
import { FixedMarker } from "@/components/FixedMarker/FixedMarker";

export const FixedContainer = ({
    fixedMarkers,
    selectedMarker,
    handleMarkerClick,
    setSelectedMarker,
    deletePin,
    isDeleteKeyPressed,
    handleDragStart,
    draggingFixedPin,
    mousePosition,
}) => {
    return (
        <div>
            {fixedMarkers.map((marker) => (
                <FixedMarker
                    draggable
                    key={marker.id}
                    marker={marker}
                    isSelected={selectedMarker === marker}
                    onClick={() => {
                        handleMarkerClick(marker);
                        setSelectedMarker(marker);
                    }}
                    onMouseOver={() => setSelectedMarker(marker)}
                    onMouseOut={() => setSelectedMarker(null)}
                    onDoubleClick={() => {
                        if (isDeleteKeyPressed) {
                            deletePin(marker);
                        }
                    }}
                    handleDragStart={handleDragStart}
                    draggingFixedPin={draggingFixedPin}
                    mousePosition={mousePosition}
                />
            ))}
        </div>
    );
};
