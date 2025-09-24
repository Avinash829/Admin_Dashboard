import { Request, Response } from "express";
import Service from "../models/serviceModel";

const getAllServices = async (_req: Request, res: Response) => {
    const services = await Service.find();
    res.json(services);
};

const getServiceById = async (req: Request, res: Response) => {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
};

const addService = async (req: Request, res: Response) => {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
};

const updateService = async (req: Request, res: Response) => {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
};

const deleteService = async (req: Request, res: Response) => {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
};

export { getAllServices, getServiceById, addService, updateService, deleteService };