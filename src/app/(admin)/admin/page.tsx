import React from 'react';
import AdminClient from './admin-client';
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';

const AdminPage = async () => {
    // First authentication layer: check if user is logged in with Clerk
    const user = await currentUser();
    const { userId } = auth();

    if (!userId || !user) {
        return redirect("/sign-in");
    }

    // Second authentication layer: check if user's email matches admin email
    const isAdmin = user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;

    if (!isAdmin) {
        console.log("User not authorized, redirecting to 404");
        return redirect("/404");
    }

    return (
        <AdminClient />
    );
};

export default AdminPage;