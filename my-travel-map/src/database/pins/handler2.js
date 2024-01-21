import { prisma } from "@/utils/connect"; // Adjust this import as per your project structure

export default async function getAllPinsAndLines(email) {
    // Fetching the user's map components along with pins and lines
    const mapComponents = await prisma.mapComponent.findMany({
        where: { user: { email: email } },
        include: {
            pins: true, // Adjust according to your needs
            lines: true, // Adjust according to your needs
        },
    });
    return mapComponents;
}

export async function addPin({ newPin, email }) {
    // Find the MapComponent for the given user email
    const userMapComponents = await prisma.mapComponent.findMany({
        where: {
            user: {
                email: email,
            },
        },
    });

    let userMapComponent;

    if (userMapComponents.length === 0) {
        // If no MapComponent exists, create a new one
        userMapComponent = await prisma.mapComponent.create({
            data: {
                user: {
                    connect: { email: email },
                },
                // Initialize other necessary fields if required
            },
        });
    } else if (userMapComponents.length === 1) {
        // Use the existing MapComponent
        userMapComponent = userMapComponents[0];
    } else {
        // If multiple MapComponents found, throw an error
        throw new Error(
            "Multiple MapComponents found for the user. Data inconsistency."
        );
    }

    // Add the new pin to the user's MapComponent
    const addedPin = await prisma.pin.create({
        data: {
            lat: newPin.latlng.lat,
            lng: newPin.latlng.lng,
            type: newPin.type,
            mapComponent: {
                connect: { id: userMapComponent.id },
            },
        },
    });

    return addedPin.id;
}

export async function updatePin({ pin, email }) {
    // Find all MapComponents associated with the user
    const userMapComponents = await prisma.mapComponent.findMany({
        where: {
            user: {
                email: email,
            },
        },
    });

    // Check the number of MapComponents found
    if (userMapComponents.length > 1) {
        throw new Error(
            "Multiple MapComponents found for the user. Data inconsistency error."
        );
    } else if (userMapComponents.length === 0) {
        throw new Error("No MapComponent found for the user.");
    }

    // Proceed with updating the pin within the user's single MapComponent
    const userMapComponent = userMapComponents[0];
    const updatedPin = await prisma.pin.updateMany({
        where: {
            id: pin.id,
            mapComponentId: userMapComponent.id,
        },
        data: {
            lat: pin.latlng.lat,
            lng: pin.latlng.lng,
            updatedDatetime: Date.now(),
            // Prisma will automatically update the updatedAt field if it is present in the model
        },
    });

    return updatedPin.id;
}

export async function getAllPins(email) {
    // Find all MapComponents associated with the user's email
    const userMapComponents = await prisma.mapComponent.findMany({
        where: {
            user: {
                email: email,
            },
        },
        include: {
            pins: true, // Include pins in the result
        },
    });

    // Check the number of MapComponents found
    if (userMapComponents.length > 1) {
        throw new Error(
            "Multiple MapComponents found for the user. Data inconsistency error."
        );
    } else if (userMapComponents.length === 0) {
        return []; // Return an empty array if no MapComponent is found
    }

    // If there is exactly one MapComponent, return its pins
    const pins = userMapComponents[0].pins.map((pin) => {
        return {
            id: pin.id,
            latlng: {
                lat: pin.lat,
                lng: pin.lng,
            },
            type: pin.type,
        };
    });

    return pins;
}

export async function deletePin({ pinId, email }) {
    // Find the user's MapComponent
    const userMapComponents = await prisma.mapComponent.findMany({
        where: {
            user: {
                email: email,
            },
        },
        include: {
            pins: true, // Include pins to check if the pin exists
        },
    });

    // Validate the number of MapComponents found
    if (userMapComponents.length > 1) {
        throw new Error('Multiple MapComponents found for the user. Data inconsistency error.');
    } else if (userMapComponents.length === 0) {
        throw new Error('No MapComponent found for the user.');
    }

    // Check if the pin exists in the user's MapComponent
    const mapComponent = userMapComponents[0];
    const pinExists = mapComponent.pins.some(pin => pin.id === pinId);

    if (!pinExists) {
        throw new Error('Pin not found in the user’s MapComponent.');
    }

    // Delete the pin
    await prisma.pin.delete({
        where: {
            id: pinId,
        },
    });

    return pinId;
}
