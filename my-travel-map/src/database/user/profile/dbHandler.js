// In your user-related handler or utility file
import prisma from "@/utils/connect";

export async function getUserProfile(email) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            // Include any related data you might need
            include: {
                accounts: true,
                sessions: true,
                // ...other relations if needed
            },
        });

        return user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error; // Or handle the error as per your application's error handling strategy
    }
}
