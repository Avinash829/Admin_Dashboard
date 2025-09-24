import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User, { IUser } from "../models/userModel";
import generateToken from "../config/generateToken";
import mongoose from "mongoose";


//  Register a new admin
// POST /api/auth/register
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
        name?: string;
        email?: string;
        password?: string;
    };

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields (name, email, password) are required");
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
        res.status(409);
        throw new Error("User already exists with this email");
    }

    const user: IUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
    });

    if (!user) {
        res.status(500);
        throw new Error("Failed to create user");
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
    });
});

//  Authenticate/login user
//  POST /api/auth/login
const authUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
    });
});

export { registerUser, authUser };
export default { registerUser, authUser };