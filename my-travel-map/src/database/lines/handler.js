import { openDb } from "@/database/database";

/* 
    LINES
*/

export async function addLine(mapPinId, fixedPinId) {
    const db = await openDb();
    await db.run(
        "INSERT INTO lines (map_pin_id, fixed_pin_id) VALUES (?, ?)",
        [mapPinId, fixedPinId]
    );
}

export async function getAllLines() {
    const db = await openDb();
    const rows = await db.all(`SELECT map_pin_id, fixed_pin_id FROM lines`);

    // Transform the lines into the desired format
    const lines = rows.map((row) => {
        return {
            id: row.id,
            map_pin_id: row.map_pin_id,
            fixed_pin_id: row.fixed_pin_id,
        };
    });

    return lines;
}

export async function deleteLine(lineId) {
    const db = await openDb();
    await db.run("DELETE FROM lines WHERE id = ?", [lineId]);
}

export async function deleteLinesRelatedToPin(pinId) {
    const db = await openDb();
    await db.run(
        "DELETE FROM lines WHERE map_pin_id = ? OR fixed_pin_id = ?",
        [pinId, pinId]
    );
}