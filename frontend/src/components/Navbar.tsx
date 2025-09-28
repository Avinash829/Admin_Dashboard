"use client";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
    const { user, logout } = useContext(UserContext);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="flex justify-between items-center bg-white shadow px-6 py-3 fixed top-0 left-0 right-0 z-20">
            <h1 className="text-xl font-bold text-indigo-600"> <span className="text-black">Willowave</span> Admin</h1>
            {user && (
                <div className="flex items-center space-x-4">Hi,
                    <span className="text-gray-700 font-bold">{user.name}</span>
                    <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                        <FiLogOut className="mr-2" /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
}