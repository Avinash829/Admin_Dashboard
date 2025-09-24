import React, { useState } from "react";

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md bg-white text-black rounded-2xl shadow-lg p-8">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Willowave
                </h1>


                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-l-xl ${isLogin ? "bg-black text-white" : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-r-xl ${!isLogin ? "bg-black text-white" : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
