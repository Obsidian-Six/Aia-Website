
// import express from "express";
// import { adminAuth } from "../middleware/adminAuth.js";

// import {
//   getPublicAssessmentConfig,
//   submitSelfAssessment,
//   getAdminAssessmentConfig,
//   updateAdminAssessmentConfig,
//   getAllSelfAssessmentSubmissions,
//   deleteSelfAssessmentSubmission,
// } from "../controllers/selfAssessmentController.js";

// const router = express.Router();

// // Public routes
// router.get("/config", getPublicAssessmentConfig);
// router.post("/submit", submitSelfAssessment);

// // Admin routes
// router.get("/admin/config", adminAuth, getAdminAssessmentConfig);
// router.put("/admin/config", adminAuth, updateAdminAssessmentConfig);

// router.get(
//   "/admin/submissions",
//   adminAuth,
//   getAllSelfAssessmentSubmissions
// );

// router.delete(
//   "/admin/submissions/:id",
//   adminAuth,
//   deleteSelfAssessmentSubmission
// );

// export default router;



import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getPublicAssessmentConfig,
  submitSelfAssessment,
  getAdminAssessmentConfig,
  updateAdminAssessmentConfig,
  getAllSelfAssessmentSubmissions,
  getSelfAssessmentSubmissionById,
  updateSelfAssessmentSubmissionStatus,
  deleteSelfAssessmentSubmission,
} from "../controllers/selfAssessmentController.js";

const router = express.Router();

// PUBLIC
router.get("/config", getPublicAssessmentConfig);
router.post("/submit", submitSelfAssessment);

// ADMIN: Assessment configuration
router.get("/admin/config", adminAuth, getAdminAssessmentConfig);
router.put("/admin/config", adminAuth, updateAdminAssessmentConfig);

// ADMIN: Assessment submissions
router.get(
  "/admin/submissions",
  adminAuth,
  getAllSelfAssessmentSubmissions
);

router.get(
  "/admin/submissions/:id",
  adminAuth,
  getSelfAssessmentSubmissionById
);

router.patch(
  "/admin/submissions/:id/status",
  adminAuth,
  updateSelfAssessmentSubmissionStatus
);

router.delete(
  "/admin/submissions/:id",
  adminAuth,
  deleteSelfAssessmentSubmission
);

export default router;
