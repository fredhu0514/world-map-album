import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";
import { getServerSession } from "next-auth";


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // GithubProvider({
        //   clientId: process.env.GITHUB_ID,
        //   clientSecret: process.env.GITHUB_SECRET,
        // }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user, token }) {
            // Add custom logic here
            // For example, adding the user ID to the session
            session.userId = user.id;
            return session;
        },
        // You can add more callbacks as needed
    },
};

export const getAuthSession = () => getServerSession(authOptions);
