
// import { Router } from "express";
// import { createBrochureEnquiry } from "../controllers/brochureEnquiryController.js";

// const router = Router();

// router.post("/", createBrochureEnquiry);

// export default router;



import { Router } from "express";

import {
  createBrochureEnquiry,
} from "../controllers/brochureEnquiryController.js";

const router = Router();

// Public brochure enquiry route
router.post("/", createBrochureEnquiry);

export default router;
