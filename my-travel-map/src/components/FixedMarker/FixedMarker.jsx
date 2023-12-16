export const FixedMarker = ({
    marker,
    isSelected,
    onClick,
    onMouseOver,
    onMouseOut,
    onDoubleClick,
}) => {
    return (
        <div
            key={marker.id}
            style={{
                position: "absolute",
                left: `${marker.latlng.lat}px`,
                top: `${marker.latlng.lng}px`,
                transform: isSelected
                    ? "translate(-15px, -52.5px)"
                    : "translate(-10px, -35px)",
                zIndex: 1000,
            }}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onDoubleClick={onDoubleClick}
        >
            <img
                src={
                    isSelected
                        ? "/fixed-marker-icon-hover.png"
                        : "/fixed-marker-icon.png"
                }
                alt="Fixed Pin"
                style={{
                    height: isSelected ? "61.5px" : "41px",
                    width: isSelected ? "61.5px" : "41px",
                }}
            />
        </div>
    );
};
