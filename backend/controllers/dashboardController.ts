import { Request, Response } from "express";
import Case from "../models/caseModel";
import Partner from "../models/partnerModel";
import Service from "../models/serviceModel";
import Team from "../models/teamModel";
import User from "../models/userModel";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [caseCount, partnerCount, serviceCount, teamCount, userCount] = await Promise.all([
            Case.countDocuments(),
            Partner.countDocuments(),
            Service.countDocuments(),
            Team.countDocuments(),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                cases: caseCount,
                partners: partnerCount,
                services: serviceCount,
                teams: teamCount,
                users: userCount,
            }
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
            error: err.message,
        });
    }
};