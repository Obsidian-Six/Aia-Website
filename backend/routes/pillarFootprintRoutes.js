
// import express from "express";
// import { adminAuth } from "../middleware/adminAuth.js";

// import {
//   getPillarFootprints,
//   createPillarFootprint,
//   updatePillarFootprint,
//   deletePillarFootprint,
// } from "../controllers/pillarFootprintController.js";

// import { pillarFootprintUpload } from "../config/pillarFootprintUpload.js";

// export const pillarFootprintRouter = express.Router();

// // Public
// pillarFootprintRouter.get("/", getPillarFootprints);

// pillarFootprintRouter.put(
//   "/:id",
//   adminAuth,
//   pillarFootprintUpload,
//   updatePillarFootprint
// );
// // Admin only
// pillarFootprintRouter.post(
//   "/",
//   adminAuth,
//   pillarFootprintUpload,
//   createPillarFootprint
// );


// pillarFootprintRouter.delete(
//   "/:id",
//   adminAuth,
//   deletePillarFootprint
// );



import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getPillarFootprints,
  createPillarFootprint,
  updatePillarFootprint,
  deletePillarFootprint,
  downloadPillarFootprintBrochure,
} from "../controllers/pillarFootprintController.js";

import { pillarFootprintUpload } from "../config/pillarFootprintUpload.js";

export const pillarFootprintRouter = express.Router();

// Public routes
pillarFootprintRouter.get("/", getPillarFootprints);

// Public brochure download route
pillarFootprintRouter.get(
  "/:id/brochure/download",
  downloadPillarFootprintBrochure
);

// Admin routes
pillarFootprintRouter.post(
  "/",
  adminAuth,
  pillarFootprintUpload,
  createPillarFootprint
);

pillarFootprintRouter.put(
  "/:id",
  adminAuth,
  pillarFootprintUpload,
  updatePillarFootprint
);

pillarFootprintRouter.delete(
  "/:id",
  adminAuth,
  deletePillarFootprint
);
