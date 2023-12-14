import { NextResponse } from "next/server";
import {
    initializeDb,
    getAllPins,
    addPin,
    deletePin,
} from "@/database/database";

export const GET = async (req, res) => {
    try {
        console.log("GET ALL COOL");
        const markers = await getAllPins();
        return NextResponse.json(markers, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to retrieve points." },
            { status: 500 }
        );
    }
};

export const POST = async (req, res) => {
    try {
        console.log("POST PIN COOL");
        const db = await initializeDb();
        const { newPin } = await req.json();
        await addPin({ newPin }); // 这里应处理添加逻辑
        return NextResponse.json(newPin, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to add a point." },
            { status: 500 }
        );
    }
};

export const DELETE = async (req, res) => {
    try {
        console.log("DELETE PIN COOL");
        const db = await initializeDb();
        const { pinId } = await req.json();
        console.log(pinId);
        await deletePin(pinId); // 这里应处理添加逻辑
        return NextResponse.json(pinId, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to delete the point." },
            { status: 500 }
        );
    }
};
