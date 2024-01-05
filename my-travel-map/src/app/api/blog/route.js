import { NextResponse } from "next/server";
import {
   initializeDb,
   getAllBlog,
} from "@/database/database";


export const GET = async (req, res) => {
    try {
        const db = await initializeDb();
        console.log("GET ALL Blogs");
        const markers = await getAllBlog();
        return NextResponse.json(markers, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve blogs." },
            { status: 500 }
        );
    }
};



