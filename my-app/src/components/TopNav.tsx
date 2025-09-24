"use client";

import { useContext, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button"; 

const TopNav = () => {
    // Demo context—replace with your real AdminContext
    // const { logout, admin } = useContext(AdminContext);
    const logout = () => { }; // dummy
    const admin = { name: "Admin User" }; // dummy

    const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setNotifications([{ id: 1, message: "New item added to database." }]);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifModal(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/admin/login");
    };

    return (
        <div className="w-full px-6 py-4 bg-white shadow-sm flex justify-end items-center relative z-50">
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifModal(!showNotifModal)}
                        className="relative focus:outline-none hover:cursor-pointer"
                    >
                        <BellIcon className="h-6 w-6 text-gray-600" />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        )}
                    </button>
                    {showNotifModal && (
                        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg z-50 p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-gray-800 font-semibold text-sm">Notifications</h3>
                                <button onClick={() => setShowNotifModal(false)}>
                                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>
                            {notifications.length > 0 ? (
                                <ul className="space-y-2 max-h-64 overflow-y-auto">
                                    {notifications.map((note) => (
                                        <li key={note.id} className="text-sm text-gray-700 border-b pb-2">
                                            {note.message}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No new messages.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative" ref={userRef}>
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <span className="text-gray-700 font-medium">
                            Hi {admin?.name || "Admin"}
                        </span>
                        <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50 py-2">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopNav;
