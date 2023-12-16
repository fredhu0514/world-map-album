import { NextResponse } from "next/server";
import {
    initializeDb,
    getAllLines,
    addLine,
    deleteLine,
} from "@/database/database";

export const GET = async (req, res) => {
    try {
        await initializeDb();
        console.log("GET ALL Lines COOL");
        const lines = await getAllLines(); // 获取所有线
        return NextResponse.json(lines, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve lines." },
            { status: 500 }
        );
    }
};

export const POST = async (req, res) => {
    try {
        console.log("POST LINE COOL");
        await initializeDb();
        const { newLine } = await req.json();

        await addLine(newLine.mapPinId, newLine.fixedPinId);
        return NextResponse.json(newLine, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to add line." },
            { status: 500 }
        );
    }
};

export const DELETE = async (req, res) => {
    try {
        await initializeDb();
        const data = await req.json();

        await deleteLine(data.lineId);
        return NextResponse.json(
            { deletedLineId: data.lineId },
            { status: 200 }
        );

        // Some scenarios will be handled by the `pins/delete`
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to delete line." },
            { status: 500 }
        );
    }
};
