const API_BASE_URL = "http://localhost:3000/api";

export const deletePin = async ({
    pinToDelete,
    setMarkers,
    setLinePairs,
    setFixedMarkers,
}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pins`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pinId: pinToDelete.id }),
        });
        await response.json();
        if (pinToDelete.type === "map") {
            setMarkers((prevMarkers) =>
                prevMarkers.filter((marker) => marker.id !== pinToDelete.id)
            );
            setLinePairs((prevPairs) =>
                prevPairs.filter((pair) => pair.mapPin.id !== pinToDelete.id)
            );
        } else if (pinToDelete.type === "fixed") {
            setFixedMarkers((prevMarkers) =>
                prevMarkers.filter((marker) => marker.id !== pinToDelete.id)
            );
            setLinePairs((prevPairs) =>
                prevPairs.filter((pair) => pair.fixedPin.id !== pinToDelete.id)
            );
        }
    } catch (error) {
        console.error(
            `[ERROR] Failed to delete the pin ${pinToDelete.id}.`,
            error
        );
    }
};
