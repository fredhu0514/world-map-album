export const calculateScreenPosition = (pin, mapInstance) => {
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