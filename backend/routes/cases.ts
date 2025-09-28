import { Router } from "express";
import { getCases, getCaseById, createCase, updateCase, deleteCase } from "../controllers/casesController";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", getCases);
router.get("/:id", getCaseById);
router.post("/", upload.array("images"), createCase);
router.put("/:id", upload.array("images"), updateCase);
router.delete("/:id", deleteCase);

export default router;