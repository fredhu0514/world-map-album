import { NextResponse } from "next/server";
import {
   initializeDb,
   addBlog,
} from "@/database/database";
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

 