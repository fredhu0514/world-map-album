import { FixedMarker } from "@/components/FixedMarker/FixedMarker";

export const FixedContainer = ({
    fixedMarkers,
    selectedMarker,
    setSelectedMarker,
    deletePin,
    isDeleteKeyPressed,
}) => {
    return (
        <div>
            {fixedMarkers.map((marker) => (
                <FixedMarker
                    key={marker.id}
                    marker={marker}
                    isSelected={selectedMarker === marker}
                    onClick={() => setSelectedMarker(marker)}
                    onMouseOver={() => setSelectedMarker(marker)}
                    onMouseOut={() => setSelectedMarker(null)}
                    onDoubleClick={() => {
                        if (isDeleteKeyPressed) {
                            deletePin(marker);
                        }
                    }}
                />
            ))}
        </div>
    );
};
