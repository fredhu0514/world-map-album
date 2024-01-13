import { NextResponse } from "next/server";
import {
    deleteLinesRelatedToPin,
} from "@/database/lines/handler";
import {
    getAllPins,
    addPin,
    deletePin,
    updatePin,
} from "@/database/pins/handler";

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
        const { pinId } = await req.json();
        await deletePin(pinId);
        await deleteLinesRelatedToPin(pinId);
        return NextResponse.json(pinId, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to delete the point." },
            { status: 500 }
        );
    }
};

export const PUT = async (req, res) => {
    try {
        console.log("PUT PIN COOL");
        const { pin } = await req.json();
        await updatePin({ pin }); // 这里应处理添加逻辑
        return NextResponse.json(pin, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Failed to update the point." },
            { status: 500 }
        );
    }
};
