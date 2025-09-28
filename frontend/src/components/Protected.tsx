"use client";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


export default function Protected({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="ml-60 mt-14 p-6 w-full">{children}</main>
            </div>
        </>
    );
}