import { Request, Response } from "express";
import Task from "../models/taskModel";

export const getTasks = async (_req: Request, res: Response) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
};

export const addTask = async (req: Request, res: Response) => {
    const { title, description, date, time, dueDate, status } = req.body;
    const task = await Task.create({
        title,
        description,
        date,
        time,
        dueDate,
        status: status || "upcoming",
    });
    res.status(201).json({ success: true, data: task });
};


export const updateTask = async (req: Request, res: Response) => {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: updated });
};

export const deleteTask = async (req: Request, res: Response) => {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
};