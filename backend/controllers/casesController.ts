import { Request, Response } from "express";
import Case from "../models/caseModel";
import cloudinary from "../config/cloudinary";

const getCases = async (_req: Request, res: Response) => {
    const cases = await Case.find();
    res.json(cases);
}

const getCaseById = async (req: Request, res: Response) => {
    const singleCase = await Case.findById(req.params.id);
    if (!singleCase) return res.status(404).json({ message: "Case not found" });
    res.json(singleCase);
}

const createCase = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        console.log("➡️ Request body:", req.body);
        console.log("➡️ Uploaded files:", req.files);

        let imageUrls: string[] = [];

        if (req.files && (req.files as Express.Multer.File[]).length > 0) {

            const uploadPromises = (req.files as Express.Multer.File[]).map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: "willowave/cases",
                    resource_type: "auto",
                })
            );

            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url);
        }

        const newCase = new Case({
            title,
            description,
            images: imageUrls,
        });

        await newCase.save();

        res.status(201).json(newCase);
    } catch (err: any) {
        console.error(" Error in createCase:", err);
        res.status(500).json({
            message: "Error creating case",
            error: err.message,
            stack: err.stack,
        });
    }
};

const updateCase = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        let imageUrls: string[] = [];

        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
            const uploadPromises = (req.files as Express.Multer.File[]).map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: "willowave/cases",
                    resource_type: "auto",
                })
            );

            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url);
        }

        const updated = await Case.findByIdAndUpdate(
            req.params.id,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(imageUrls.length > 0 && { images: imageUrls }),
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Case not found" });

        res.json(updated);
    } catch (err: any) {
        console.error(" Error in updateCase:", err);
        res.status(500).json({
            message: "Error updating case",
            error: err.message,
        });
    }
};


const deleteCase = async (req: Request, res: Response) => {
    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Case not found" });
    res.json({ message: "Case deleted" });
}

export { getCases, getCaseById, createCase, updateCase, deleteCase };