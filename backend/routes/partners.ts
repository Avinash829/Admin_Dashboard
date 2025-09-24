import { Router } from "express";
import { getAllPartners, getPartnerById, addPartner, updatePartner, deletePartner } from "../controllers/partnerController";

const router = Router();

router.get("/", getAllPartners);
router.get("/:id", getPartnerById);
router.post("/", addPartner);
router.put("/:id", updatePartner);
router.delete("/:id", deletePartner);

export default router;