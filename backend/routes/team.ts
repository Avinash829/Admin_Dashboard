import { Router } from "express";
import { getAllTeamMembers, getTeamMemberById, addTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController";

const router = Router();

router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);
router.post("/", addTeamMember);
router.put("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;