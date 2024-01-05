import { NextResponse } from "next/server";
import {
   initializeDb,
   deleteBlog,
   addBlog 
} from "@/database/database";

export const DELETE = async (req, res) => {
    try {
        await initializeDb();
        console.log("DELETE BLOG POST");
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
        console.log("POST NEW BLOG POST");
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
