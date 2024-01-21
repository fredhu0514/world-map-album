// Only initialization script runs this file

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function openDb() {
    return open({
        filename: "./mydb.sqlite",
        driver: sqlite3.Database,
    });
}

async function initializeDb() {
    const db = await openDb();
    await db.exec(`CREATE TABLE IF NOT EXISTS pins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        _type TEXT NOT NULL,
        userId TEXT NOT NULL
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        map_pin_id INTEGER NOT NULL,
        fixed_pin_id INTEGER NOT NULL,
        userId TEXT NOT NULL
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS blog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp REAL NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    )`);
 
    return db;
}

initializeDb()
    .then(() => {
        console.log('Database has been initialized.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error initializing database:', err);
        process.exit(1);
    });