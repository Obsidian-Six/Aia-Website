import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { sliderImageUpload } from "../config/upload.js";
import {
  getPublicHighlights, getAdminHighlights, saveHighlight, deleteHighlight,
} from "../controllers/featuredCompanyHighlightController.js";

const router = Router();
const uploadBanner = sliderImageUpload.single("banner");
router.get("/", getPublicHighlights);
router.get("/admin", adminAuth, getAdminHighlights);
router.post("/", adminAuth, uploadBanner, saveHighlight);
router.put("/:id", adminAuth, uploadBanner, saveHighlight);
router.delete("/:id", adminAuth, deleteHighlight);

export default router;
