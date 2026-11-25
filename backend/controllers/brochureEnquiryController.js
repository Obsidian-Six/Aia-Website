
// import mongoose from "mongoose";
// import { Event } from "../models/Event.js";
// import { PillarFootprint } from "../models/PillarFootprint.js";

// import { setBrochureAccessCookie } from "../utils/brochureAccess.js";
// import FormSubmission from "../models/FormSubmission.js";

// export const createBrochureEnquiry = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       email,
//       message,
//       resourceType,
//       resourceId,
//     } = req.body;

//     if (!name?.trim() || !phone?.trim() || !email?.trim() || !message?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all enquiry fields.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(normalizedEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//     }

//     if (!["event", "pillar-footprint"].includes(resourceType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid brochure resource type.",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(resourceId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid brochure resource.",
//       });
//     }

//     const Model =
//       resourceType === "event" ? Event : PillarFootprint;

//     const resource = await Model.findById(resourceId)
//       .select("+brochurePublicId");

//     if (
//       !resource ||
//       !resource.hasBrochure ||
//       !resource.brochurePublicId
//     ) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure is not available.",
//       });
//     }

//     await FormSubmission.create({
//       formType: "brochure-enquiry",
//       sourcePage: resourceType,
//       data: {
//         name: name.trim(),
//         phone: phone.trim(),
//         email: normalizedEmail,
//         message: message.trim(),
//         resourceType,
//         resourceId,
//         resourceTitle: resource.title,
//       },
//       status: "new",
//       isRead: false,
//     });

//     // Generate and save access token in browser cookie.
//     setBrochureAccessCookie(res);

//     return res.status(201).json({
//       success: true,
//       message: "Enquiry submitted successfully.",
//       accessGranted: true,
//     });
//   } catch (error) {
//     console.error("Brochure enquiry error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to submit brochure enquiry.",
//     });
//   }
// };



// import mongoose from "mongoose";

// import { Event } from "../models/Event.js";
// import { PillarFootprint } from "../models/PillarFootprint.js";

// import FormSubmission from "../models/FormSubmission.js";
// import { setBrochureAccessCookie } from "../utils/brochureAccess.js";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// export const createBrochureEnquiry = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       email,
//       message,
//       resourceType,
//       resourceId,
//     } = req.body || {};

//     // Normalize input values
//     const normalizedName = String(name || "").trim();
//     const normalizedPhone = String(phone || "").trim();
//     const normalizedEmail = String(email || "").trim().toLowerCase();
//     const normalizedMessage = String(message || "").trim();

//     // Validate required fields
//     if (
//       !normalizedName ||
//       !normalizedPhone ||
//       !normalizedEmail ||
//       !normalizedMessage
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all enquiry fields.",
//       });
//     }

//     // Validate email
//     if (!emailRegex.test(normalizedEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//     }

//     // Validate phone number
//     if (
//       normalizedPhone.length < 7 ||
//       normalizedPhone.length > 20
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid phone number.",
//       });
//     }

//     // Validate resource type
//     if (!["event", "pillar-footprint"].includes(resourceType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid brochure resource type.",
//       });
//     }

//     // Validate MongoDB ID
//     if (!mongoose.Types.ObjectId.isValid(resourceId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid brochure resource.",
//       });
//     }

//     // Select resource model
//     const Model =
//       resourceType === "event"
//         ? Event
//         : PillarFootprint;

//     // Fetch requested resource
//     const resource = await Model.findById(resourceId)
//       .select("+brochurePublicId");

//     if (!resource) {
//       return res.status(404).json({
//         success: false,
//         message: "Requested resource not found.",
//       });
//     }

//     // Verify brochure availability
//     if (
//       !resource.hasBrochure ||
//       !resource.brochurePublicId
//     ) {
//       return res.status(404).json({
//         success: false,
//         message: "Brochure is not available.",
//       });
//     }

//     // Check publication status when the model has isActive.
//     if (
//       resource.isActive !== undefined &&
//       resource.isActive === false
//     ) {
//       return res.status(404).json({
//         success: false,
//         message: "Requested resource is not available.",
//       });
//     }

//     // Save enquiry in existing FormSubmission collection
//     const submission = await FormSubmission.create({
//       formType: "brochure-enquiry",
//       sourcePage: resourceType,
//       data: {
//         name: normalizedName,
//         phone: normalizedPhone,
//         email: normalizedEmail,
//         message: normalizedMessage,
//         resourceType,
//         resourceId: String(resource._id),
//         resourceTitle: resource.title || "",
//       },
//       status: "new",
//       isRead: false,
//     });

//     // Grant shared brochure access after successful save
//     setBrochureAccessCookie(res);

//     return res.status(201).json({
//       success: true,
//       message: "Enquiry submitted successfully.",
//       accessGranted: true,
//       submissionId: submission._id,
//     });
//   } catch (error) {
//     console.error("Brochure enquiry error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to submit brochure enquiry.",
//     });
//   }
// };



import mongoose from "mongoose";

import { Event } from "../models/Event.js";
import { PillarFootprint } from "../models/PillarFootprint.js";

import FormSubmission from "../models/FormSubmission.js";
import { setBrochureAccessCookie } from "../utils/brochureAccess.js";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_RESOURCES = {
  "campus-connect": {
    title: "AIA Campus Connect Sample",
    fileName: "campus+connect+sampler.pdf",
    filePath: path.resolve(
      __dirname,
      "../private-samples/campus+connect+sampler.pdf"
    ),
  },
};

export const createBrochureEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      message,
      resourceType,
      resourceId,
    } = req.body || {};

    const normalizedName = String(name || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedMessage = String(message || "").trim();

    // Required fields
    if (
      !normalizedName ||
      !normalizedPhone ||
      !normalizedEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required enquiry fields.",
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      normalizedPhone.length < 7 ||
      normalizedPhone.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    let resourceTitle = "";
    let normalizedResourceId = "";

    // SAMPLE RESOURCE
    if (resourceType === "sample") {
      const sample = SAMPLE_RESOURCES[resourceId];

      if (!sample) {
        return res.status(400).json({
          success: false,
          message: "Invalid sample resource.",
        });
      }

      try {
        await fs.access(sample.filePath);
      } catch {
        return res.status(404).json({
          success: false,
          message: "Sample PDF not found.",
        });
      }

      resourceTitle = sample.title;
      normalizedResourceId = resourceId;
    }

    // EVENT OR PILLAR FOOTPRINT RESOURCE
    else if (
      ["event", "pillar-footprint"].includes(resourceType)
    ) {
      if (!mongoose.Types.ObjectId.isValid(resourceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brochure resource.",
        });
      }

      const Model =
        resourceType === "event"
          ? Event
          : PillarFootprint;

      const resource = await Model.findById(resourceId)
        .select("+brochurePublicId");

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Requested resource not found.",
        });
      }

      if (
        !resource.hasBrochure ||
        !resource.brochurePublicId
      ) {
        return res.status(404).json({
          success: false,
          message: "Brochure is not available.",
        });
      }

      if (
        resource.isActive !== undefined &&
        resource.isActive === false
      ) {
        return res.status(404).json({
          success: false,
          message: "Requested resource is not available.",
        });
      }

      resourceTitle = resource.title || "";
      normalizedResourceId = String(resource._id);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid brochure resource type.",
      });
    }

    // Save enquiry
   const submission = await FormSubmission.create({
  formType: "brochure-enquiry",
  sourcePage: resourceType,
  data: {
    name: normalizedName,
    phone: normalizedPhone,
    email: normalizedEmail,
    message: normalizedMessage,
    resourceType,
    resourceId: normalizedResourceId,
    resourceTitle,
  },
  status: "new",
  isRead: false,
  googleSheetsSync: {
    status: "pending",
    attempts: 0,
    nextRetryAt: new Date(),
  },
});

    // Grant shared access only after successful save
    setBrochureAccessCookie(res);

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      accessGranted: true,
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Brochure enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit brochure enquiry.",
    });
  }
};
