const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

// Provide the correct path to the existing myBlog.db
const dbPath = '/Users/zhuminxuan/world-map-album-1/my-travel-map/myBlog.db'; // Replace with the actual path to your myBlog.db
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    throw err;
  } else {
    console.log('Connected to the existing myBlog.db database.');
  }
});

// POST endpoint to add a new blog post
app.post('/blog', (req, res) => {
  const { PID, title, description } = req.body;
  const sql = `INSERT INTO blog_posts (PID, title, description) VALUES (?, ?, ?)`;

  db.run(sql, [PID, title, description], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});