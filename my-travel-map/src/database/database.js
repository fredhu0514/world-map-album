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
        PID TEXT NOT NULL,
        _TYPE TEXT NOT NULL
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        map_pin_id INTEGER NOT NULL,
        fixed_pin_id INTEGER NOT NULL,
        map_pin_pid TEXT NOT NULL,
        fixed_pin_pid TEXT NOT NULL
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS blog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pid REAL NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    )`);
 
    return db;
}

/* 
    LINES
*/

export async function addLine(mapPinId, fixedPinId) {
    const db = await openDb();
    await db.run(
        "INSERT INTO lines (map_pin_id, fixed_pin_id, map_pin_pid, fixed_pin_pid) VALUES (?, ?, ?, ?)",
        [0, 0, mapPinId, fixedPinId]
    );
}

export async function getAllLines() {
    const db = await openDb();
    const rows = await db.all(`SELECT map_pin_pid, fixed_pin_pid FROM lines`);

    // Transform the lines into the desired format
    const lines = rows.map((row) => {
        return {
            id: row.id,
            map_pin_id: row.map_pin_pid,
            fixed_pin_id: row.fixed_pin_pid,
        };
    });

    return lines;
}

export async function deleteLine(lineId) {
    const db = await openDb();
    await db.run("DELETE FROM lines WHERE id = ?", [lineId]);
}

// 用于在删除端点时删除相关的连线
export async function deleteLinesRelatedToPin(pinId) {
    const db = await openDb();
    await db.run(
        "DELETE FROM lines WHERE map_pin_pid = ? OR fixed_pin_pid = ?",
        [pinId, pinId]
    );
}

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
    deleteLinesRelatedToPin(pinId);
}

/*
   BLOGs
*/

// Function to add a new blog
export async function addBlog(pid, title, description) {
    const db = await openDb();
    const result = await db.run(
        `INSERT INTO blog (pid, title, description) VALUES (?, ?, ?)`,
        [pid, title, description]
    );
    return { id: result.lastID };  // Return the id of the inserted blog post
 }
 
 // Function to retrieve blog by Id
 export async function getBlogById(id) {
    const db = await openDb();
    const row = await db.get(`SELECT id, pid, title, description FROM blog WHERE id = ?`, [id]);
    return {
        id: row.id,
        pid: row.pid,
        title: row.title,
        description: row.description
    }; // Return the transformed single row, which is the blog with the given id
 }
 
 // Function to delete a blog post by id
 export async function deleteBlog(id) {
    const db = await openDb();
    await db.run(`DELETE FROM blog WHERE id = ?`, [id]);
 }
 
 // Function to update a blog post
 export async function updateBlog(id, title, description) {
    const db = await openDb();
    const result = await db.run(
        `UPDATE blog SET title = ?, description = ? WHERE id = ?`,
        [title, description, id]
    );
    return { updated: result.changes > 0 };  // Return an object indicating if any row was updated
 }

 // Function to get all blogs
 export async function getAllBlogs() {
    const db = await openDb();
    // Select only the id, pid, and title, description columns from the blog table
    const rows = await db.all(`SELECT id, pid, title, description FROM blog`);
    
    // Transform the data to include only id, pid, title, and description
    const blogPosts = rows.map((row) => {
        return {
            id: row.id,
            pid: row.pid,
            title: row.title,
            description: row.description
        };
    });
    
    return blogPosts;
}
