import { openDb } from "@/database/database";

/* 
    PINS
*/

export async function addPin({ newPin }) {
    const db = await openDb();
    await db.run(
        `INSERT INTO pins (lat, lng, PID, _TYPE) VALUES (?, ?, ?, ?)`,
        [newPin.latlng.lat, newPin.latlng.lng, newPin.id, newPin.type]
    );
}

export async function updatePin({ pin }) {
    const db = await openDb();
    await db.run(
        `UPDATE pins SET lat = ?, lng = ? WHERE PID = ?`,
        [pin.latlng.lat, pin.latlng.lng, pin.id]
    );
}

export async function getAllPins() {
    const db = await openDb();
    const rows = await db.all(`SELECT PID, lat, lng, _TYPE FROM pins`);

    // Transform the data into the desired format
    const pins = rows.map((row) => {
        return {
            id: row.PID,
            latlng: {
                lat: row.lat,
                lng: row.lng,
            },
            type: row._TYPE,
        };
    });

    return pins;
}

export async function deletePin(pinId) {
    const db = await openDb();
    await db.run(`DELETE FROM pins WHERE PID = ?`, pinId);
}