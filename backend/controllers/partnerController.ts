import { Request, Response } from "express";
import Partner from "../models/partnerModel";

const getAllPartners = async (_req: Request, res: Response) => {
    const partners = await Partner.find();
    res.json(partners);
};

const getPartnerById = async (req: Request, res: Response) => {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
};

const addPartner = async (req: Request, res: Response) => {
    const newPartner = new Partner(req.body);
    await newPartner.save();
    res.status(201).json(newPartner);
};

const updatePartner = async (req: Request, res: Response) => {
    const updated = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Partner not found" });
    res.json(updated);
};

const deletePartner = async (req: Request, res: Response) => {
    const deleted = await Partner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Partner not found" });
    res.json({ message: "Partner deleted" });
};

export { getAllPartners, getPartnerById, addPartner, updatePartner, deletePartner };