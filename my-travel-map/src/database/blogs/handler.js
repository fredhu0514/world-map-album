import { openDb } from "@/database/database";

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
