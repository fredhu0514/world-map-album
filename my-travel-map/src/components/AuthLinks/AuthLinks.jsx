import Link from "next/link";
import styles from "./authLinks.module.css";
import { useSession } from "next-auth/react";

export const AuthLinks = () => {
    const { data: session, status } = useSession();
    const profileUrl = "/user/profile";

    console.log(session);
    if (status === "unauthenticated") {
        return (
            <Link href="/login">
                <span className={styles.loginButton}>Login</span>
            </Link>
        );
    }

    if (status === "authenticated" && session?.user) {
        return (
            <div className={styles.userInfoContainer}>
                <Link href={profileUrl}>
                    <img
                        src={session.user.image || "/default-avatar.png"}
                        alt="Profile"
                        className={styles.avatar}
                    />
                </Link>
                {/* Additional links or dropdown can be added here */}
            </div>
        );
    }

    // Default placeholder for loading or undefined states
    return <div className={styles.loadingPlaceholder}>Loading...</div>;
};
