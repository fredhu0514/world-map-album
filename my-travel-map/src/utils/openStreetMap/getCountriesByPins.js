import { keccak256 } from "ethers";

function normalizeLongitude(lng) {
    return (((lng + 180) % 360) + 360) % 360 - 180;
}

async function fetchCountryForCoordinates(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${normalizeLongitude(lng)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.address?.country || null;
    } catch (error) {
        console.error("Error fetching country name:", error);
        return null;
    }
}

async function addPin(id, latlng, countryNames, idToCountry) {
    const country = await fetchCountryForCoordinates(latlng.lat, latlng.lng);
    if (country) {
        countryNames.add(country);
        idToCountry.set(id, country);
    }
}

function removePin(id, countryNames, idToCountry) {
    const country = idToCountry.get(id);
    if (country) {
        idToCountry.delete(id);
        // Check if this country is associated with any other pin
        if (!Array.from(idToCountry.values()).includes(country)) {
            countryNames.delete(country);
        }
    }
}

export async function getUniqueCountryNames(latLongList) {
    const countryNames = new Set();
    const idToCountry = new Map();

    for (const { id, latlng } of latLongList) {
        await addPin(id, latlng, countryNames, idToCountry);
    }

    return {
        countrySet: Array.from(countryNames), 
        idToCountry: idToCountry
    };
}
