"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiBriefcase, FiUsers, FiLayers } from "react-icons/fi";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: FiGrid },
    { name: "Cases", href: "/cases", icon: FiBriefcase },
    { name: "Partners", href: "/partners", icon: FiUsers },
    { name: "Services", href: "/services", icon: FiLayers },
    { name: "Teams", href: "/teams", icon: FiUsers },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="fixed top-14 left-0 w-60 h-screen bg-white shadow">
            <nav className="mt-4 px-2">
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.name}>
                            <Link href={item.href} className={`flex items-center px-3 py-2 rounded-lg transition ${pathname === item.href ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-50"
                                }`}>
                                <item.icon className="mr-3" /> {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}