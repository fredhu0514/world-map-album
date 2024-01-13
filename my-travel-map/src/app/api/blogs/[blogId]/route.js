import { NextResponse } from "next/server";
import {
   getBlogById
} from "@/database/blogs/handler";

export const GET = async (req, { params }) => {
    try {
        const { blogId } = params;
        console.log(`GET BLOG WITH ID: ${blogId}`);

        const blog = await getBlogById(blogId); // Fetch the blog by its ID

        // Check if the blog exists
        if (blog) {
            return NextResponse.json(blog, { status: 200 });
        } else {
            return NextResponse.json(
                { message: "Blog not found." },
                { status: 404 }
            );
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve the blog." },
            { status: 500 }
        );
    }
};
