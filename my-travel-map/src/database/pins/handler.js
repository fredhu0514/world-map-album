import { openDb } from "@/database/database";

/* 
    PINS
*/

export async function addPin({ newPin }) {
    const db = await openDb();
    const result = await db.run(
        `INSERT INTO pins (lat, lng, created_at, updated_at, _type) VALUES (?, ?, ?, ?, ?)`,
        [newPin.latlng.lat, newPin.latlng.lng, Date.now(), Date.now(), newPin.type]
    );
    return result.lastID;
}

export async function updatePin({ pin }) {
    const db = await openDb();
    await db.run(
        `UPDATE pins SET lat = ?, lng = ?, updated_at = ? WHERE id = ?`,
        [pin.latlng.lat, pin.latlng.lng, Date.now(), pin.id]
    );
}

export async function getAllPins() {
    const db = await openDb();
    const rows = await db.all(`SELECT id, lat, lng, _type FROM pins`);

    // Transform the data into the desired format
    const pins = rows.map((row) => {
        return {
            id: row.id,
            latlng: {
                lat: row.lat,
                lng: row.lng,
            },
            type: row._type,
        };
    });

    return pins;
}

export async function deletePin(pinId) {
    const db = await openDb();
    await db.run(`DELETE FROM pins WHERE id = ?`, pinId);
}