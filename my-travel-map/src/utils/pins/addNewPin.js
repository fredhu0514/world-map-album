const API_BASE_URL = "http://localhost:3000/api";

export const addNewPin = async ({
    latlng,
    mapInstance,
    temporaryPinConversion,
    isFKeyPressed,
    isPKeyPressed,
    setFixedMarkers,
    setMarkers,
}) => {
    const newPin = { latlng };
    try {
        if (isFKeyPressed && mapInstance) {
            const point = mapInstance.latLngToContainerPoint(latlng);
            const newFixedPin = {
                latlng: { lat: point.x, lng: point.y },
                type: "fixed",
            };
            const response = await fetch(`${API_BASE_URL}/pins`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPin: newFixedPin }),
            });
            const addedPin = await response.json();
            setFixedMarkers((prevFixedMarkers) => [
                ...prevFixedMarkers,
                addedPin,
            ]);
        } else if (isPKeyPressed || temporaryPinConversion) {
            const newMapPin = { ...newPin, type: "map" };
            const response = await fetch(`${API_BASE_URL}/pins`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPin: newMapPin }),
            });
            const addedPin = await response.json();
            setMarkers((prevMarkers) => [...prevMarkers, addedPin]);
        }
    } catch (error) {
        console.error("[ERROR] Failed to add a new pin.", error);
    }
};
