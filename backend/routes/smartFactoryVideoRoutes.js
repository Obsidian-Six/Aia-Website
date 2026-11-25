
import express from "express";

import {
  getSmartFactoryVideos,
  getAllSmartFactoryVideos,
  createSmartFactoryVideo,
  updateSmartFactoryVideo,
  deleteSmartFactoryVideo,
} from "../controllers/smartFactoryVideoController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Public API - only active videos
router.get("/", getSmartFactoryVideos);

// Admin APIs
router.get("/admin", adminAuth, getAllSmartFactoryVideos);
router.post("/admin", adminAuth, createSmartFactoryVideo);
router.put("/admin/:id", adminAuth, updateSmartFactoryVideo);
router.delete("/admin/:id", adminAuth, deleteSmartFactoryVideo);

export default router;
