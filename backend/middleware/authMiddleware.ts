import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import mongoose from "mongoose";


export interface AuthRequest extends Request {
    user?: {
        _id: string;
        name: string;
        email: string;
    } | null;
}


interface DecodedToken extends JwtPayload {
    id?: string;
}

const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && (req.cookies.token || req.cookies.jwt)) {
        token = req.cookies.token || req.cookies.jwt;
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const id = decoded.id;
        if (!id) {
            res.status(401);
            throw new Error("Not authorized, invalid token payload");
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            res.status(401);
            throw new Error("Not authorized, user not found");
        }

        req.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        };


        next();
    } catch (err) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

export { protect };
