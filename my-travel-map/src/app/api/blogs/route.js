import { NextResponse } from "next/server";

import {
   initializeDb,
   
} from "@/database/database";

import {
    addBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
 } from "@/database/blogs/handler";

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
        const { blog } = await req.json();
        const newBlogId = await addBlog(blog.timestamp, blog.title, blog.description);
        return NextResponse.json({ newBlogId }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to create a new blog post." },
            { status: 500 }
        );
    }
 };


 export const GET = async (req, res) => {
    try {
        const { searchParams } = new URL(req.url);
        console.log(">>>>",searchParams)
        await initializeDb();
        
        const blog = await getBlogById(searchParams.get('id'))
        console.log(blog)
        return NextResponse.json(
            { blog },
            { status: 201 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Blog ID does not exist." },
            { status: 500 }
        );
    }
 };

 export const PUT = async (req, res) => {
    try {
        await initializeDb();
        
        const { blog } = await req.json();
        console.log({blog})
        console.log("POST PUT BLOG POST",blog.id);
        const newBlogId = await updateBlog(blog.id, blog.title, blog.description);
        return NextResponse.json({ newBlogId }, { status: 201 });
    } catch (err) {
        // console.log(err);
        return NextResponse.json(
            { message: "Failed to put a new blog post." },
            { status: 500 }
        );
    }
 };