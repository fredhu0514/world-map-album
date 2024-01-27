import { openDb } from "@/database/database";

 // Function to retrieve all blog posts
export async function getBlogById(id) {
    console.log(id+"id");
    const db = await openDb();
    const row = await db.get(`SELECT id, timestamp, title, description FROM blog WHERE id = ?`, [id]);
    return row; // Return the single row, which is the blog post with the given timestamp
 }

 // Function to add a new blog post
export async function addBlog(timestamp, title, description) {
    const db = await openDb();
    const result = await db.run(
        `INSERT INTO blog (timestamp, title, description) VALUES (?, ?, ?)`,
        [timestamp, title, description]
    );
    return { id: result.lastID };  // Return the id of the inserted blog post
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
    // Select only the id, timestamp, and title, description columns from the blog table
    const rows = await db.all(`SELECT id, timestamp, title, description FROM blog`);
    
    // Transform the data to include only id, timestamp, title, and description
    const blogPosts = rows.map((row) => {
        return {
            id: row.id,
            timestamp: row.timestamp,
            title: row.title,
            description: row.description
        };
    });
    
    return blogPosts;
}
