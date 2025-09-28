"use client";
import { createContext, useState, useEffect, ReactNode } from "react";


export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}
interface UserContextType {
    user: User | null;
    login: (u: User) => void;
    logout: () => void;
    isLoading?: boolean;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
});


export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 new

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed) setUser(parsed);
            } catch (err) {
                console.error("Invalid user JSON in localStorage:", stored, err);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);


    const login = (u: User) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}