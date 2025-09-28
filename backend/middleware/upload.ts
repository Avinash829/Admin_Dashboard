import { Request } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req: Request, file: Express.Multer.File) => {
        return {
            folder: "willowave/cases",
            resource_type: "auto",
            public_id: file.originalname.split(".")[0],
        };
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});
