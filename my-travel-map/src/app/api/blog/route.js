import { NextResponse } from "next/server";
import {
   initializeDb,
   deleteBlog,
} from "@/database/database";

export const DELETE = async (req, res) => {
    try {
        await initializeDb();
        console.log("DELETE BLOG POST");
        const { id } = await req.json(); // Extract blog id from the request body
        await deleteBlog(id);
        return NextResponse.json({ id }, { status: 200 }); // Respond with the deleted id
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to delete the blog post." },
            { status: 500 }
        );
    }
 };
 
