// components/FixedMarker/FixedMarker.jsx
export const FixedMarker = ({
    marker,
    isSelected,
    onClick,
    onMouseOver,
    onMouseOut,
    onDoubleClick,
    handleDragStart,
    draggingFixedPin,
    mousePosition, 
}) => {
    
    // 计算样式
    let style = {
        position: "absolute",
        left: `${marker.latlng.lat}px`,
        top: `${marker.latlng.lng}px`,
        transform: isSelected
            ? "translate(-15px, -52.5px)"
            : "translate(-10px, -35px)",
        zIndex: 1000,
        // 其他样式...
    };

    // 如果正在拖动这个marker，更新其位置
    if (draggingFixedPin && draggingFixedPin.id === marker.id) {
        style = {
            ...style,
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
        };
    }


    return (
        <div
            key={marker.id}
            draggable="true"
            style={style}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onDoubleClick={onDoubleClick}
            onDragStart={(e) => handleDragStart(e, marker)}
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
