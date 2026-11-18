
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getPublishedConversations,
  getPublishedConversationBySlug,
  getAllConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  reorderConversations,
} from "../controllers/conversationController.js";

import { conversationAudioUpload } from "../config/audioStorage.js";

const router = express.Router();

// Public routes
router.get("/published", getPublishedConversations);
router.get("/published/:slug", getPublishedConversationBySlug);

// Admin routes
router.get("/admin", adminAuth, getAllConversations);

router.post(
  "/admin",
  adminAuth,
  conversationAudioUpload.single("audio"),
  createConversation
);

router.put(
  "/admin/:id",
  adminAuth,
  conversationAudioUpload.single("audio"),
  updateConversation
);

router.patch(
  "/admin/reorder",
  adminAuth,
  reorderConversations
);

router.delete(
  "/admin/:id",
  adminAuth,
  deleteConversation
);

export default router;
