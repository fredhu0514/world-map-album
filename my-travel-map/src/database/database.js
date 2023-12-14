const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function openDb() {
    return open({
        filename: "./mydb.sqlite",
        driver: sqlite3.Database,
    });
}

export async function initializeDb() {
    const db = await openDb();
    await db.exec(`CREATE TABLE IF NOT EXISTS pins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    PID TEXT NOT NULL
  )`);
    return db;
}

export async function addPin({ newPin }) {
    const db = await openDb();
    await db.run(`INSERT INTO pins (lat, lng, PID) VALUES (?, ?, ?)`, [
        newPin.latlng.lat,
        newPin.latlng.lng,
        newPin.id,
    ]);
}

export async function getAllPins() {
    const db = await openDb();
    const rows = await db.all(`SELECT PID, lat, lng FROM pins`);

    // Transform the data into the desired format
    const pins = rows.map((row) => {
        return {
            id: row.PID,
            latlng: {
                lat: row.lat,
                lng: row.lng,
            },
        };
    });

    return pins;
}

export async function deletePin(pinId) {
    const db = await openDb();
    await db.run(`DELETE FROM pins WHERE PID = ?`, pinId);
}
