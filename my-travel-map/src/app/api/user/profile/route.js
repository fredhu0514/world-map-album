import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";
import { getUserProfile } from "@/database/user/profile/dbHandler";

export const GET = async (req, res) => {
    const session = await getAuthSession();

    if (!session) {
        return new NextResponse(
            JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
        );
    }

    const email = session.user.email; // Assuming session is already available here
    try {
        const userProfile = await getUserProfile(email);
        return NextResponse.json(userProfile, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to retrieve user profile." },
            { status: 500 }
        );
    }
};
