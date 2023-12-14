import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: " World Album",
    description: "Precious travel memories~",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <div>{children}</div>
                </AuthProvider>
            </body>
        </html>
    );
}
