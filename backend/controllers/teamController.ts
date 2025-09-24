import { Request, Response } from "express";
import Team from "../models/teamModel";

const getAllTeamMembers = async (_req: Request, res: Response) => {
    const members = await Team.find();
    res.json(members);
};

const getTeamMemberById = async (req: Request, res: Response) => {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
};

const addTeamMember = async (req: Request, res: Response) => {
    const newMember = new Team(req.body);
    await newMember.save();
    res.status(201).json(newMember);
};

const updateTeamMember = async (req: Request, res: Response) => {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Team member not found" });
    res.json(updated);
};

const deleteTeamMember = async (req: Request, res: Response) => {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Team member not found" });
    res.json({ message: "Team member deleted" });
};

export { getAllTeamMembers, getTeamMemberById, addTeamMember, updateTeamMember, deleteTeamMember };