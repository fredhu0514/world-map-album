import { NextResponse } from "next/server";
import {
   initializeDb,
   deleteBlog,
   addBlog,
   getAllBlog,
} from "@/database/database";

export const DELETE = async (req, res) => {
    try {
        await initializeDb();
        console.log("DELETE BLOG BY ID");
        const { id } = await req.json(); // Extract blog id from the request body
        await deleteBlog(id);
        return NextResponse.json({ id }, { status: 201 }); // Respond with the deleted id
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to delete the blog post." },
            { status: 500 }
        );
    }
 };

export const POST = async (req, res) => {
    try {
        await initializeDb();
        console.log("POST NEW BLOG");
        const { pid, title, description } = await req.json();
        const newBlogId = await addBlog(pid, title, description);
        return NextResponse.json({ newBlogId }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to create a new blog post." },
            { status: 500 }
        );
    }
 };

// In the future, this function will be getAllBlogs by user ID.
export const GET = async (req, res) => {
    try {
        const db = await initializeDb();
        console.log("GET ALL BLOGS");
        const blogs = await getAllBlog();
        return NextResponse.json(blogs, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve blogs." },
            { status: 500 }
        );
    }
};
