import { Router } from "express";
import { getTasks, addTask, updateTask, deleteTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getTasks);
router.post("/", protect, addTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;