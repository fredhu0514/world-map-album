"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./profilePage.module.css";
import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { status } = useSession();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("/api/user/profile"); // Adjust the endpoint as needed
                if (!response.ok) throw new Error("Profile fetch failed");
                const data = await response.json();
                setUserProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsEditing(false);
        // Add logic to save the updated user profile
    };

    const handleLogout = () => {
        // Add logic for logout
        signOut();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {
                status === "unauthenticated" ? (
                    <div className="userProfileContainer">
                        <div className="userProfileHeader">
                            <h1>User Profile</h1>
                        </div>
                        <div className="userProfileContent">
                            <p>Please <Link href="/login">log in</Link> to view your profile.</p>
                        </div>
                    </div>
                ) : (
                    <div className="userProfileContainer">
                        <div className="userProfileHeader">
                            <h1>User Profile</h1>
                            {isEditing ? (
                                <button className="saveButton" onClick={handleSave}>
                                    Save
                                </button>
                            ) : (
                                <button className="editButton" onClick={handleEdit}>
                                    Edit
                                </button>
                            )}
                        </div>
                        {userProfile && (
                            <div className="userProfileContent">
                                {/* Display and edit user data as needed */}
                            </div>
                        )}
                        <button className="logoutButton" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )
            }
        </>
        
        
    );
};

export default UserProfile;
