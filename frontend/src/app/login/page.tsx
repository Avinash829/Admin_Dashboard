"use client";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useContext(UserContext);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            console.log("Login response:", res.data);

            const user = res.data.data;

            localStorage.setItem("token", user.token);
            login(user);

            router.push("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    };




    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="bg-white shadow rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl text-center font-bold text-indigo-600">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Login</button>
                </form>
            </div>
        </div>
    );
}
