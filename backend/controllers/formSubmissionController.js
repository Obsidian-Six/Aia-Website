
// import mongoose from "mongoose";
// import FormSubmission, { FORM_TYPES } from "../models/FormSubmission.js";
// // import FormSubmission from "../models/FormSubmission";


// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// const getEmail = (data = {}) =>
//   String(data.email || data.ceoEmail || data.submittedByEmail || "")
//     .trim()
//     .toLowerCase();

// const validateSubmission = (formType, data) => {
//   if (!data || typeof data !== "object" || Array.isArray(data)) {
//     return "Invalid form data.";
//   }

//   const requiredFields = {
//     "contact-us": [
//   "fullName",
//   "email",
//   "inquiry",
//   "phone",
//   "message",
// ],
//     "general-inquiry": [
//       "category",
//       "selectedOption",
//       "fullName",
//       "email",
//       "companyName",
//       "website",
//       "phoneNumber",
//     ],
//     "aia-membership": ["companyName", "membershipClass"],
//     "system-integrator": [
//       "fullName",
//       "companyName",
//       "email",
//       "phone",
//       "businessHelp",
//     ],
//     "technology-provider": [
//       "fullName",
//       "companyName",
//       "email",
//       "phone",
//       "businessHelp",
//     ],
//   };

//   const missing = (requiredFields[formType] || []).filter((field) => {
//     const value = data[field];
//     return value === undefined || value === null || String(value).trim() === "";
//   });

//   if (missing.length) {
//     return `Please provide required fields: ${missing.join(", ")}`;
//   }

//   const email = getEmail(data);

//   if (email && !emailRegex.test(email)) {
//     return "Please provide a valid email address.";
//   }

//   return null;
// };

// // PUBLIC: Create submission
// export const createFormSubmission = async (req, res) => {
//   try {
//     const { formType, sourcePage = "", data } = req.body;

//     if (!FORM_TYPES.includes(formType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid form type.",
//       });
//     }

//     const validationError = validateSubmission(formType, data);

//     if (validationError) {
//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     const submission = await FormSubmission.create({
//       formType,
//       sourcePage: String(sourcePage || "").trim(),
//       data,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Form submitted successfully.",
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Create Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit form.",
//     });
//   }
// };

// // ADMIN: Get submissions with optional filters
// export const getFormSubmissions = async (req, res) => {
//   try {
//     const {
//       formType,
//       status,
//       search = "",
//       page = 1,
//       limit = 20,
//     } = req.query;

//     const filter = {};

//     if (formType && formType !== "all") {
//       if (!FORM_TYPES.includes(formType)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid form type filter.",
//         });
//       }

//       filter.formType = formType;
//     }

//     if (status && status !== "all") {
//       if (!["new", "contacted", "closed"].includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid status filter.",
//         });
//       }

//       filter.status = status;
//     }

//     const safePage = Math.max(1, Number(page) || 1);
//     const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

//     if (search.trim()) {
//       const regex = new RegExp(
//         search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
//         "i"
//       );

//       filter.$or = [
//         { "data.fullName": regex },
//         { "data.name": regex },
//         { "data.companyName": regex },
//         { "data.email": regex },
//         { "data.phone": regex },
//         { "data.phoneNumber": regex },
//         { "data.ceoName": regex },
//         { "data.submittedByName": regex },
//       ];
//     }

//     const [submissions, total] = await Promise.all([
//       FormSubmission.find(filter)
//         .sort({ createdAt: -1 })
//         .skip((safePage - 1) * safeLimit)
//         .limit(safeLimit)
//         .lean(),

//       FormSubmission.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       count: submissions.length,
//       total,
//       page: safePage,
//       totalPages: Math.ceil(total / safeLimit),
//       data: submissions,
//     });
//   } catch (error) {
//     console.error("Get Form Submissions Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch form submissions.",
//     });
//   }
// };

// // ADMIN: Get one submission
// export const getFormSubmissionById = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid submission ID.",
//       });
//     }

//     const submission = await FormSubmission.findById(req.params.id);

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     // Opening a submission marks it as read
//     if (!submission.isRead) {
//       submission.isRead = true;
//       await submission.save();
//     }

//     return res.status(200).json({
//       success: true,
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Get Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch submission.",
//     });
//   }
// };

// // ADMIN: Update status
// export const updateFormSubmissionStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["new", "contacted", "closed"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid submission status.",
//       });
//     }

//     const submission = await FormSubmission.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Submission status updated.",
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Update Submission Status Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update submission status.",
//     });
//   }
// };

// // ADMIN: Delete submission
// export const deleteFormSubmission = async (req, res) => {
//   try {
//     const submission = await FormSubmission.findByIdAndDelete(req.params.id);

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Submission deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete submission.",
//     });
//   }
// };



// export const getFormSubmissionStats = async (req, res) => {
//   try {
//     const [
//       total,
//       newCount,
//       unread,
//       contacted,
//       closed,
//       pending,
//     ] = await Promise.all([
//       FormSubmission.countDocuments({}),
//       FormSubmission.countDocuments({ status: "new" }),
//       FormSubmission.countDocuments({ isRead: false }),
//       FormSubmission.countDocuments({ status: "contacted" }),
//       FormSubmission.countDocuments({ status: "closed" }),
//       FormSubmission.countDocuments({
//         status: { $ne: "closed" },
//       }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: {
//         total,
//         new: newCount,
//         unread,
//         contacted,
//         closed,
//         pending,
//       },
//     });
//   } catch (error) {
//     console.error("Form submission stats error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch form submission statistics.",
//     });
//   }
// };



// import mongoose from "mongoose";
// import FormSubmission, {
//   FORM_TYPES,
// } from "../models/FormSubmission.js";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// const getEmail = (data = {}) =>
//   String(data.email || data.ceoEmail || data.submittedByEmail || "")
//     .trim()
//     .toLowerCase();

// const validateSubmission = (formType, data) => {
//   if (!data || typeof data !== "object" || Array.isArray(data)) {
//     return "Invalid form data.";
//   }

//   const requiredFields = {
//     "contact-us": [
//       "fullName",
//       "email",
//       "inquiry",
//       "phone",
//       "message",
//     ],

//     "general-inquiry": [
//       "category",
//       "selectedOption",
//       "fullName",
//       "email",
//       "companyName",
//       "website",
//       "phoneNumber",
//     ],

//     "aia-membership": [
//       "companyName",
//       "membershipClass",
//     ],

//     "system-integrator": [
//       "fullName",
//       "companyName",
//       "email",
//       "phone",
//       "businessHelp",
//     ],

//     "technology-provider": [
//       "fullName",
//       "companyName",
//       "email",
//       "phone",
//       "businessHelp",
//     ],

//     // Brochure enquiry form
//     "brochure-enquiry": [
//       "name",
//       "phone",
//       "email",
//       "message",
//     ],
//   };

//   const missing = (requiredFields[formType] || []).filter((field) => {
//     const value = data[field];

//     return (
//       value === undefined ||
//       value === null ||
//       String(value).trim() === ""
//     );
//   });

//   if (missing.length) {
//     return `Please provide required fields: ${missing.join(", ")}`;
//   }

//   const email = getEmail(data);

//   if (email && !emailRegex.test(email)) {
//     return "Please provide a valid email address.";
//   }

//   return null;
// };

// // PUBLIC: Create submission
// export const createFormSubmission = async (req, res) => {
//   try {
//     const { formType, sourcePage = "", data } = req.body;

//     if (!FORM_TYPES.includes(formType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid form type.",
//       });
//     }

//     const validationError = validateSubmission(formType, data);

//     if (validationError) {
//       return res.status(400).json({
//         success: false,
//         message: validationError,
//       });
//     }

//     const submission = await FormSubmission.create({
//       formType,
//       sourcePage: String(sourcePage || "").trim(),
//       data,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Form submitted successfully.",
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Create Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit form.",
//     });
//   }
// };

// // ADMIN: Get submissions with optional filters
// export const getFormSubmissions = async (req, res) => {
//   try {
//     const {
//       formType,
//       status,
//       search = "",
//       page = 1,
//       limit = 20,
//     } = req.query;

//     const filter = {};

//     if (formType && formType !== "all") {
//       if (!FORM_TYPES.includes(formType)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid form type filter.",
//         });
//       }

//       filter.formType = formType;
//     }

//     if (status && status !== "all") {
//       if (!["new", "contacted", "closed"].includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid status filter.",
//         });
//       }

//       filter.status = status;
//     }

//     const safePage = Math.max(1, Number(page) || 1);
//     const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

//     if (String(search).trim()) {
//       const escapedSearch = String(search)
//         .trim()
//         .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//       const regex = new RegExp(escapedSearch, "i");

//       filter.$or = [
//         { "data.fullName": regex },
//         { "data.name": regex },
//         { "data.companyName": regex },
//         { "data.email": regex },
//         { "data.phone": regex },
//         { "data.phoneNumber": regex },
//         { "data.ceoName": regex },
//         { "data.submittedByName": regex },
//       ];
//     }

//     const [submissions, total] = await Promise.all([
//       FormSubmission.find(filter)
//         .sort({ createdAt: -1 })
//         .skip((safePage - 1) * safeLimit)
//         .limit(safeLimit)
//         .lean(),

//       FormSubmission.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       count: submissions.length,
//       total,
//       page: safePage,
//       totalPages: Math.ceil(total / safeLimit),
//       data: submissions,
//     });
//   } catch (error) {
//     console.error("Get Form Submissions Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch form submissions.",
//     });
//   }
// };

// // ADMIN: Get one submission
// export const getFormSubmissionById = async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid submission ID.",
//       });
//     }

//     const submission = await FormSubmission.findById(req.params.id);

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     if (!submission.isRead) {
//       submission.isRead = true;
//       await submission.save();
//     }

//     return res.status(200).json({
//       success: true,
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Get Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch submission.",
//     });
//   }
// };

// // ADMIN: Update status
// export const updateFormSubmissionStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["new", "contacted", "closed"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid submission status.",
//       });
//     }

//     const submission = await FormSubmission.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Submission status updated.",
//       data: submission,
//     });
//   } catch (error) {
//     console.error("Update Submission Status Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update submission status.",
//     });
//   }
// };

// // ADMIN: Delete submission
// export const deleteFormSubmission = async (req, res) => {
//   try {
//     const submission = await FormSubmission.findByIdAndDelete(req.params.id);

//     if (!submission) {
//       return res.status(404).json({
//         success: false,
//         message: "Submission not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Submission deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete Form Submission Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete submission.",
//     });
//   }
// };

// // ADMIN: Submission statistics
// export const getFormSubmissionStats = async (req, res) => {
//   try {
//     const [
//       total,
//       newCount,
//       unread,
//       contacted,
//       closed,
//       pending,
//     ] = await Promise.all([
//       FormSubmission.countDocuments({}),
//       FormSubmission.countDocuments({ status: "new" }),
//       FormSubmission.countDocuments({ isRead: false }),
//       FormSubmission.countDocuments({ status: "contacted" }),
//       FormSubmission.countDocuments({ status: "closed" }),
//       FormSubmission.countDocuments({
//         status: { $ne: "closed" },
//       }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: {
//         total,
//         new: newCount,
//         unread,
//         contacted,
//         closed,
//         pending,
//       },
//     });
//   } catch (error) {
//     console.error("Form submission stats error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch form submission statistics.",
//     });
//   }
// };


import mongoose from "mongoose";
import FormSubmission, {
  FORM_TYPES,
} from "../models/FormSubmission.js";

import {
  setBrochureAccessCookie,
} from "../utils/brochureAccess.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getEmail = (data = {}) =>
  String(data.email || data.ceoEmail || data.submittedByEmail || "")
    .trim()
    .toLowerCase();

const validateSubmission = (formType, data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid form data.";
  }

  const requiredFields = {
    "contact-us": [
      "fullName",
      "email",
      "inquiry",
      "phone",
      "message",
    ],

    "general-inquiry": [
      "category",
      "selectedOption",
      "fullName",
      "email",
      "companyName",
      "website",
      "phoneNumber",
    ],

    "aia-membership": [
      "companyName",
      "membershipClass",
    ],

    "system-integrator": [
      "fullName",
      "companyName",
      "email",
      "phone",
      "businessHelp",
    ],

    "technology-provider": [
      "fullName",
      "companyName",
      "email",
      "phone",
      "businessHelp",
    ],

    "brochure-enquiry": [
      "name",
      "phone",
      "email",
      "message",
    ],
  };

  const missing = (requiredFields[formType] || []).filter((field) => {
    const value = data[field];

    return (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    );
  });

  if (missing.length) {
    return `Please provide required fields: ${missing.join(", ")}`;
  }

  const email = getEmail(data);

  if (email && !emailRegex.test(email)) {
    return "Please provide a valid email address.";
  }

  return null;
};

// PUBLIC: Create regular form submission
export const createFormSubmission = async (req, res) => {
  try {
    const { formType, sourcePage = "", data } = req.body;

    if (!FORM_TYPES.includes(formType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form type.",
      });
    }

    // Brochure enquiries must use the dedicated endpoint
    // because that endpoint also grants shared brochure access.
    if (formType === "brochure-enquiry") {
      return res.status(400).json({
        success: false,
        message: "Please use the brochure enquiry endpoint.",
      });
    }

    const validationError = validateSubmission(formType, data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const submission = await FormSubmission.create({
      formType,
      sourcePage: String(sourcePage || "").trim(),
      data,
    });

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully.",
      data: submission,
    });
  } catch (error) {
    console.error("Create Form Submission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit form.",
    });
  }
};

// PUBLIC: Create brochure enquiry and grant shared brochure access
export const createBrochureEnquiry = async (req, res) => {
  try {
    // Supports both:
    // { name, phone, email, message, sourcePage }
    // and:
    // { data: { name, phone, email, message }, sourcePage }
    const submittedData =
      req.body?.data &&
      typeof req.body.data === "object" &&
      !Array.isArray(req.body.data)
        ? req.body.data
        : req.body;

    const data = {
      name: String(submittedData?.name || "").trim(),
      phone: String(submittedData?.phone || "").trim(),
      email: String(submittedData?.email || "").trim().toLowerCase(),
      message: String(submittedData?.message || "").trim(),
    };

    const validationError = validateSubmission(
      "brochure-enquiry",
      data
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const sourcePage = String(
      req.body?.sourcePage || submittedData?.sourcePage || ""
    ).trim();

    // Save enquiry first.
    const submission = await FormSubmission.create({
      formType: "brochure-enquiry",
      sourcePage,
      data,
    });

    // Grant shared access only after successful database save.
    setBrochureAccessCookie(res);

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. Brochure access granted.",
      accessGranted: true,
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Create Brochure Enquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit brochure enquiry.",
    });
  }
};

// ADMIN: Get submissions with optional filters
export const getFormSubmissions = async (req, res) => {
  try {
    const {
      formType,
      status,
      search = "",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (formType && formType !== "all") {
      if (!FORM_TYPES.includes(formType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid form type filter.",
        });
      }

      filter.formType = formType;
    }

    if (status && status !== "all") {
      if (!["new", "contacted", "closed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }

      filter.status = status;
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    if (String(search).trim()) {
      const escapedSearch = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { "data.fullName": regex },
        { "data.name": regex },
        { "data.companyName": regex },
        { "data.email": regex },
        { "data.phone": regex },
        { "data.phoneNumber": regex },
        { "data.ceoName": regex },
        { "data.submittedByName": regex },
      ];
    }

    const [submissions, total] = await Promise.all([
      FormSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),

      FormSubmission.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: submissions,
    });
  } catch (error) {
    console.error("Get Form Submissions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch form submissions.",
    });
  }
};

// ADMIN: Get one submission
export const getFormSubmissionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await FormSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (!submission.isRead) {
      submission.isRead = true;
      await submission.save();
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Get Form Submission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch submission.",
    });
  }
};

// ADMIN: Update status
export const updateFormSubmissionStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission status.",
      });
    }

    const submission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission status updated.",
      data: submission,
    });
  } catch (error) {
    console.error("Update Submission Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update submission status.",
    });
  }
};

// ADMIN: Delete submission
export const deleteFormSubmission = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await FormSubmission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Form Submission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete submission.",
    });
  }
};

// ADMIN: Submission statistics
export const getFormSubmissionStats = async (req, res) => {
  try {
    const [
      total,
      newCount,
      unread,
      contacted,
      closed,
      pending,
    ] = await Promise.all([
      FormSubmission.countDocuments({}),
      FormSubmission.countDocuments({ status: "new" }),
      FormSubmission.countDocuments({ isRead: false }),
      FormSubmission.countDocuments({ status: "contacted" }),
      FormSubmission.countDocuments({ status: "closed" }),
      FormSubmission.countDocuments({
        status: { $ne: "closed" },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        new: newCount,
        unread,
        contacted,
        closed,
        pending,
      },
    });
  } catch (error) {
    console.error("Form submission stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch form submission statistics.",
    });
  }
};
