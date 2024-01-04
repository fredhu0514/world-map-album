import { NextResponse } from "next/server";
import {
   initializeDb,
   addBlog,
   updateBlog,
} from "@/database/database";
export const PUT = async (req, res) => {
    try {
        await initializeDb();
        const { id, title, description } = await req.json();
        if (!id) {
            return NextResponse.json(
                { message: "No pid provided for updating" },
                { status: 400 }
            );
        }
        console.log(`UPDATE BLOG POST WITH ID: ${id}`);
        const result = await updateBlog(id, title, description);
        if (result.updated) {
            return NextResponse.json({ message: "Blog post updated successfully" }, { status: 200 });
        } else {
            return NextResponse.json(
                { message: "Blog post not found or no changes made" },
                { status: 404 }
            );
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to update the blog post." },
            { status: 500 }
        );
    }
 };
 

