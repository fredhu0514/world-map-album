import { useEffect } from "react";
import { fetchApi } from "@/utils/fetchApi";

const API_BASE_URL = "http://localhost:3000/api";

const useFetchPinsAndLines = (
    setMarkers,
    setFixedMarkers,
    setLinePairs
) => {
    useEffect(() => {
        const fetchPinsAndLines = async () => {
            try {
                // Fetch and set pins
                const receivedMarkers = await fetchApi(`${API_BASE_URL}/pins`);
                const mapPins = receivedMarkers.filter(
                    (marker) => marker.type === "map"
                );
                const fixedPins = receivedMarkers.filter(
                    (marker) => marker.type === "fixed"
                );

                setMarkers(mapPins);
                setFixedMarkers(fixedPins);

                // Fetch and process lines
                const receivedLines = await fetchApi(`${API_BASE_URL}/lines`);
                const lines = receivedLines.map((line) => ({
                    mapPin: mapPins.find(
                        (marker) => marker.id === line.map_pin_id
                    ),
                    fixedPin: fixedPins.find(
                        (marker) => marker.id === line.fixed_pin_id
                    ),
                }));

                setLinePairs(lines);
            } catch (error) {
                console.error("Error fetching pins and lines: ", error);
            }
        };

        fetchPinsAndLines();
    }, []);
};

export default useFetchPinsAndLines;