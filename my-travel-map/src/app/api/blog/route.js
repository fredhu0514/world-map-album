import { NextResponse } from "next/server";
import {
    initializeDb,
    addBlog,
    getAllBlogs,
    deleteBlog,
} from "@/database/database"; // Make sure the path to your database file is correct

// GET all blog posts
export const GET = async (req, res) => {
    try {
        await initializeDb();
        console.log("GET ALL BLOG POSTS");
        const blogs = await getAllBlogs();
        return NextResponse.json(blogs, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve blog posts." },
            { status: 500 }
        );
    }
};

// POST a new blog post
export const POST = async (req, res) => {
    try {
        await initializeDb();
        console.log("POST NEW BLOG POST");
        const { pid, title, description } = await req.json();
        const newBlog = await addBlog(pid, title, description);
        return NextResponse.json({ newBlog }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to create a new blog post." },
            { status: 500 }
        );
    }
};

// DELETE a blog post
export const DELETE = async (req, res) => {
    try {
        await initializeDb();
        console.log("DELETE BLOG POST");
        const { blogId } = await req.json();
        await deleteBlog(blogId);
        return NextResponse.json({ id: blogId }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to delete the blog post." },
            { status: 500 }
        );
    }
};

