export const keyPress = (key) => {
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

export const keyRelease = (key, setSelectedMapPin, setSelectedFixedPin) => {
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

export const searchLocation = async (
    searchTerm,
    geoCodeLocation,
    setSearchedLocation,
    setOriginalLng,
    setTemporaryPin,
    mapRef
) => {
    try {
        const result = await geoCodeLocation(searchTerm);
        setSearchedLocation(result);
        setOriginalLng(result.lng);
        setTemporaryPin([result.lat, result.lng]);
        console.log("Ref", mapRef);
        if (mapRef.current) {
            let zoomLevel;
            switch (result.type) {
                case "tertiary":
                    zoomLevel = 20;
                    break;
                case "landmark":
                    zoomLevel = 17;
                    break;
                case "research_institute":
                case "university":
                case "aerodrome":
                case "park":
                    zoomLevel = 16;
                    break;
                case "water":
                    zoomLevel = 13;
                    break;
                case "administrative":
                    zoomLevel = 12;
                    break;
                case "country":
                    zoomLevel = 5;
                    break;
                default:
                    zoomLevel = 15; // default zoom level
            }
            mapRef.current.setView([result.lat, result.lng], zoomLevel);
        }
    } catch (error) {
        console.error("Error during location search:", error);
    }
};

export const adjustLongitude = async (
    adjustment,
    searchedLocation,
    mapRef,
    setSearchedLocation,
    temporaryPin,
    setTemporaryPin
) => {
    if (mapRef.current && searchedLocation) {
        const newLng = searchedLocation.lng + adjustment;
        mapRef.current.setView(
            [searchedLocation.lat, newLng],
            mapRef.current.getZoom()
        );
        setSearchedLocation({ ...searchedLocation, lng: newLng });
        if (temporaryPin) {
            setTemporaryPin([searchedLocation.lat, newLng]);
        }
    }
};

export const resetLocation = async (
    searchedLocation,
    originalLng,
    mapRef,
    setSearchedLocation,
    temporaryPin,
    setTemporaryPin
) => {
    if (mapRef.current && searchedLocation && originalLng !== null) {
        mapRef.current.setView(
            [searchedLocation.lat, originalLng],
            mapRef.current.getZoom()
        );
        setSearchedLocation({ ...searchedLocation, lng: originalLng });
        if (temporaryPin) {
            setTemporaryPin([searchedLocation.lat, originalLng]);
        }
    }
};

export const keyMap = {
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

export const markerClick = (
    marker,
    isCKeyPressed,
    selectedMapPin,
    selectedFixedPin,
    setLinePairs,
    linePairs,
    setSelectedMapPin,
    setSelectedFixedPin
) => {
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
            .catch((error) => {
                console.error(
                    "[ERROR] Failed to add a new line. Error: ",
                    error
                );
            });

        setSelectedMapPin(null);
        setSelectedFixedPin(null);
    }
};

export const addTemporaryPinPermanently = (temporaryPin, handleAddNewPin, setTemporaryPin) => {
    if (temporaryPin) {
        const latlng = { lat: temporaryPin[0], lng: temporaryPin[1] };
        handleAddNewPin({
            latlng,
            temporaryPinConversion: true,
        });
    }
    setTemporaryPin(null);
};

export const onDragStart = (e, marker, isMKeyPressed, setOriginalPosition, setDraggingFixedPin) => {
    e.preventDefault();
    if (isMKeyPressed && !marker.isDragging) {
        console.log("Rly manipulating it now.");
        setOriginalPosition(marker.latlng);
        setDraggingFixedPin(marker);
    }
};