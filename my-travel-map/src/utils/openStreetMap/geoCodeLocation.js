// We use OpenStreetMap Nominatim Non-Commercial API 
// to get the coordinates of a location.
export const geoCodeLocation = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
        throw new Error('Location not found.');
    }
    
    const resultType = data[0].type; // get the type of the result
    return { 
        lat: parseFloat(data[0].lat), 
        lng: parseFloat(data[0].lon),
        type: resultType // include the type in the returned object
    };
};