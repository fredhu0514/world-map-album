const sqlite3 = require('sqlite3').verbose();

// Open a database connection
let db = new sqlite3.Database('./myBlog.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a new table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  PID REAL NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
)`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Table created or already exists.');
  }
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
