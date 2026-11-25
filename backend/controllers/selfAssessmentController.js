
// import mongoose from "mongoose";
// import SelfAssessmentConfig from "../models/SelfAssessmentConfig.js";
// import SelfAssessmentSubmission from "../models/SelfAssessmentSubmission.js";

// const DEFAULT_FUNCTION_OPTIONS = [
//   "Plant Operations",
//   "Production",
//   "Engineering",
//   "Quality",
//   "Maintenance",
//   "Supply Chain",
//   "IT Services",
//   "Automation Services",
//   "Human Resources",
// ];

// const DEFAULT_SECTIONS = [
//   {
//     sectionNumber: "01",
//     title: "Sensing Infrastructure",
//     description: "Sensors, PLCs, Energy Meters, Gauges, Vision",
//     question:
//       "How extensively are sensing technologies implemented in your manufacturing operations?",
//     options: [
//       "Sensors",
//       "PLCs",
//       "Energy Meters",
//       "Gauges",
//       "Vision",
//     ],
//     order: 1,
//   },
//   {
//     sectionNumber: "02",
//     title: "Connectivity Infrastructure",
//     description: "Edge Gateways, OPC UA, MQTT, Secure Data Hub",
//     question:
//       "How well connected are your manufacturing systems and equipment for data collection and communication?",
//     options: [
//       "Edge Gateways",
//       "OPC UA",
//       "MQTT",
//       "Secure Data Hub",
//     ],
//     order: 2,
//   },
//   {
//     sectionNumber: "03",
//     title: "Visualisation Infrastructure",
//     description: "Real-time Dashboards for OEE, Downtime, SPC",
//     question:
//       "To what extent do you use real-time dashboards to monitor manufacturing performance?",
//     options: [
//       "Real-time Dashboards for OEE",
//       "Downtime",
//       "SPC",
//     ],
//     order: 3,
//   },
//   {
//     sectionNumber: "04",
//     title: "Act",
//     description:
//       "Alerts, Loss Logging, Digital Work Instructions, Escalation",
//     question:
//       "How effectively are alerts, loss logging and digital work instructions used to take corrective action?",
//     options: [
//       "Alerts",
//       "Loss Logging",
//       "Digital Work Instructions",
//       "Escalation",
//     ],
//     order: 4,
//   },
//   {
//     sectionNumber: "05",
//     title: "Improve",
//     description: "Pareto, Root Cause, Kaizen, and SOP Updates",
//     question:
//       "How systematically does your organisation use data for root cause analysis and continuous improvement?",
//     options: [
//       "Pareto",
//       "Root Cause",
//       "Kaizen",
//       "SOP Updates",
//     ],
//     order: 5,
//   },
// ];

// const getOrCreateConfig = async () => {
//   let config = await SelfAssessmentConfig.findOne({
//     configKey: "manufacturers-self-assessment",
//   });

//   if (!config) {
//     config = await SelfAssessmentConfig.create({
//       configKey: "manufacturers-self-assessment",
//       functionOptions: DEFAULT_FUNCTION_OPTIONS,
//       sections: DEFAULT_SECTIONS,
//     });
//   }

//   return config;
// };

// // PUBLIC: Get active assessment configuration
// export const getPublicAssessmentConfig = async (req, res) => {
//   try {
//     const config = await getOrCreateConfig();

//     return res.status(200).json({
//       success: true,
//       data: {
//         functionOptions: config.functionOptions,
//         sections: config.sections
//           .filter((section) => section.isActive)
//           .sort((a, b) => a.order - b.order),
//       },
//     });
//   } catch (error) {
//     console.error("Get assessment config error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to load assessment configuration.",
//     });
//   }
// };

// // PUBLIC: Submit assessment
// export const submitSelfAssessment = async (req, res) => {
//   try {
//     const {
//       participant,
//       responses,
//       sourceVideo,
//     } = req.body;

//     if (
//       !participant?.name ||
//       !participant?.function ||
//       !participant?.company ||
//       !participant?.email ||
//       !participant?.countryCode ||
//       !participant?.mobile
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please complete all required participant details.",
//       });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(participant.email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid email address.",
//       });
//     }

//     if (!Array.isArray(responses)) {
//       return res.status(400).json({
//         success: false,
//         message: "Assessment responses are required.",
//       });
//     }

//     const config = await getOrCreateConfig();

//     const activeSections = config.sections.filter(
//       (section) => section.isActive
//     );

//     if (responses.length !== activeSections.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Please answer every assessment question.",
//       });
//     }

//     const validatedResponses = [];

//     for (const section of activeSections) {
//       const submittedResponse = responses.find(
//         (response) =>
//           String(response.sectionId) === String(section._id)
//       );

//       if (!submittedResponse?.selectedOption) {
//         return res.status(400).json({
//           success: false,
//           message: `Please answer: ${section.title}`,
//         });
//       }

//       const isValidOption = section.options.includes(
//         submittedResponse.selectedOption
//       );

//       if (!isValidOption) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid response for ${section.title}.`,
//         });
//       }

//       validatedResponses.push({
//         sectionId: section._id,
//         sectionNumber: section.sectionNumber,
//         sectionTitle: section.title,
//         question: section.question,
//         selectedOption: submittedResponse.selectedOption,
//       });
//     }

//     const validFunction = config.functionOptions.includes(
//       participant.function
//     );

//     if (!validFunction) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a valid function.",
//       });
//     }

//     const submission = await SelfAssessmentSubmission.create({
//       participant: {
//         name: participant.name,
//         function: participant.function,
//         company: participant.company,
//         email: participant.email,
//         countryCode: participant.countryCode,
//         mobile: participant.mobile,
//         website: participant.website || "",
//       },
//       responses: validatedResponses,
//       sourceVideo: {
//         videoId: sourceVideo?.videoId || "",
//         videoTitle: sourceVideo?.videoTitle || "",
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Your assessment has been submitted successfully.",
//       data: {
//         submissionId: submission._id,
//       },
//     });
//   } catch (error) {
//     console.error("Submit self-assessment error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to submit your assessment.",
//     });
//   }
// };

// // ADMIN: Get complete configuration
// export const getAdminAssessmentConfig = async (req, res) => {
//   try {
//     const config = await getOrCreateConfig();

//     return res.status(200).json({
//       success: true,
//       data: config,
//     });
//   } catch (error) {
//     console.error("Get admin assessment config error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to load assessment configuration.",
//     });
//   }
// };

// // ADMIN: Update configuration
// export const updateAdminAssessmentConfig = async (req, res) => {
//   try {
//     const { functionOptions, sections } = req.body;

//     if (!Array.isArray(functionOptions) || !Array.isArray(sections)) {
//       return res.status(400).json({
//         success: false,
//         message: "Function options and assessment sections are required.",
//       });
//     }

//     const cleanFunctionOptions = functionOptions
//       .map((option) => String(option).trim())
//       .filter(Boolean);

//     const cleanSections = sections.map((section, index) => {
//       if (
//         !section.title?.trim() ||
//         !section.question?.trim() ||
//         !Array.isArray(section.options)
//       ) {
//         throw new Error(
//           `Please provide a title, question and options for section ${index + 1}.`
//         );
//       }

//       return {
//         ...(mongoose.Types.ObjectId.isValid(section._id)
//           ? { _id: section._id }
//           : {}),
//         sectionNumber: String(section.sectionNumber || index + 1).trim(),
//         title: String(section.title).trim(),
//         description: String(section.description || "").trim(),
//         question: String(section.question).trim(),
//         options: section.options
//           .map((option) => String(option).trim())
//           .filter(Boolean),
//         isActive: section.isActive !== false,
//         order: Number.isFinite(Number(section.order))
//           ? Number(section.order)
//           : index + 1,
//       };
//     });

//     const config = await SelfAssessmentConfig.findOneAndUpdate(
//       { configKey: "manufacturers-self-assessment" },
//       {
//         $set: {
//           functionOptions: cleanFunctionOptions,
//           sections: cleanSections,
//         },
//         $setOnInsert: {
//           configKey: "manufacturers-self-assessment",
//         },
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//         setDefaultsOnInsert: true,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Assessment configuration updated successfully.",
//       data: config,
//     });
//   } catch (error) {
//     console.error("Update assessment config error:", error);

//     return res.status(400).json({
//       success: false,
//       message:
//         error.message || "Unable to update assessment configuration.",
//     });
//   }
// };

// // ADMIN: Get all submissions
// export const getAllSelfAssessmentSubmissions = async (req, res) => {
//   try {
//     const submissions = await SelfAssessmentSubmission.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       count: submissions.length,
//       data: submissions,
//     });
//   } catch (error) {
//     console.error("Get assessment submissions error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch assessment submissions.",
//     });
//   }
// };

// // ADMIN: Delete a submission
// export const deleteSelfAssessmentSubmission = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid submission ID.",
//       });
//     }

//     const submission = await SelfAssessmentSubmission.findByIdAndDelete(id);

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
//     console.error("Delete assessment submission error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Unable to delete submission.",
//     });
//   }
// };



import mongoose from "mongoose";

import SelfAssessmentConfig from "../models/SelfAssessmentConfig.js";
import SelfAssessmentSubmission from "../models/SelfAssessmentSubmission.js";

const DEFAULT_FUNCTION_OPTIONS = [
  "Plant Operations",
  "Production",
  "Engineering",
  "Quality",
  "Maintenance",
  "Supply Chain",
  "IT Services",
  "Automation Services",
  "Human Resources",
];

const DEFAULT_SECTIONS = [
  {
    sectionNumber: "01",
    title: "Sensing Infrastructure",
    description: "Sensors, PLCs, Energy Meters, Gauges, Vision",
    question:
      "How extensively are sensing technologies implemented in your manufacturing operations?",
    options: [
      "Sensors",
      "PLCs",
      "Energy Meters",
      "Gauges",
      "Vision",
    ],
    order: 1,
  },
  {
    sectionNumber: "02",
    title: "Connectivity Infrastructure",
    description: "Edge Gateways, OPC UA, MQTT, Secure Data Hub",
    question:
      "How well connected are your manufacturing systems and equipment for data collection and communication?",
    options: [
      "Edge Gateways",
      "OPC UA",
      "MQTT",
      "Secure Data Hub",
    ],
    order: 2,
  },
  {
    sectionNumber: "03",
    title: "Visualisation Infrastructure",
    description: "Real-time Dashboards for OEE, Downtime, SPC",
    question:
      "To what extent do you use real-time dashboards to monitor manufacturing performance?",
    options: [
      "Real-time Dashboards for OEE",
      "Downtime",
      "SPC",
    ],
    order: 3,
  },
  {
    sectionNumber: "04",
    title: "Act",
    description:
      "Alerts, Loss Logging, Digital Work Instructions, Escalation",
    question:
      "How effectively are alerts, loss logging and digital work instructions used to take corrective action?",
    options: [
      "Alerts",
      "Loss Logging",
      "Digital Work Instructions",
      "Escalation",
    ],
    order: 4,
  },
  {
    sectionNumber: "05",
    title: "Improve",
    description: "Pareto, Root Cause, Kaizen, and SOP Updates",
    question:
      "How systematically does your organisation use data for root cause analysis and continuous improvement?",
    options: [
      "Pareto",
      "Root Cause",
      "Kaizen",
      "SOP Updates",
    ],
    order: 5,
  },
];

const VALID_SUBMISSION_STATUSES = [
  "new",
  "contacted",
  "closed",
];

const getOrCreateConfig = async () => {
  let config = await SelfAssessmentConfig.findOne({
    configKey: "manufacturers-self-assessment",
  });

  if (!config) {
    config = await SelfAssessmentConfig.create({
      configKey: "manufacturers-self-assessment",
      functionOptions: DEFAULT_FUNCTION_OPTIONS,
      sections: DEFAULT_SECTIONS,
    });
  }

  return config;
};

const escapeRegex = (value = "") =>
  String(value)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildAssessmentSearchFilter = (search) => {
  const filter = {};
  const cleanSearch = String(search || "").trim();

  if (!cleanSearch) return filter;

  const regex = new RegExp(escapeRegex(cleanSearch), "i");

  filter.$or = [
    { "participant.name": regex },
    { "participant.function": regex },
    { "participant.company": regex },
    { "participant.email": regex },
    { "participant.mobile": regex },
    { "sourceVideo.videoTitle": regex },
    { "sourceVideo.videoId": regex },
  ];

  return filter;
};

// PUBLIC: Get active assessment configuration
export const getPublicAssessmentConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();

    return res.status(200).json({
      success: true,
      data: {
        functionOptions: config.functionOptions,
        sections: config.sections
          .filter((section) => section.isActive)
          .sort((a, b) => a.order - b.order),
      },
    });
  } catch (error) {
    console.error("Get assessment config error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment configuration.",
    });
  }
};

// PUBLIC: Submit assessment
export const submitSelfAssessment = async (req, res) => {
  try {
    const {
      participant,
      responses,
      sourceVideo,
    } = req.body;

    if (
      !participant?.name ||
      !participant?.function ||
      !participant?.company ||
      !participant?.email ||
      !participant?.countryCode ||
      !participant?.mobile
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required participant details.",
      });
    }

    const email = String(participant.email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "Assessment responses are required.",
      });
    }

    const config = await getOrCreateConfig();

    const activeSections = config.sections
      .filter((section) => section.isActive)
      .sort((a, b) => a.order - b.order);

    if (responses.length !== activeSections.length) {
      return res.status(400).json({
        success: false,
        message: "Please answer every assessment question.",
      });
    }

    const validatedResponses = [];

    for (const section of activeSections) {
      const submittedResponse = responses.find(
        (response) =>
          String(response.sectionId) === String(section._id)
      );

      if (!submittedResponse?.selectedOption) {
        return res.status(400).json({
          success: false,
          message: `Please answer: ${section.title}`,
        });
      }

      const isValidOption = section.options.includes(
        submittedResponse.selectedOption
      );

      if (!isValidOption) {
        return res.status(400).json({
          success: false,
          message: `Invalid response for ${section.title}.`,
        });
      }

      validatedResponses.push({
        sectionId: section._id,
        sectionNumber: section.sectionNumber,
        sectionTitle: section.title,
        question: section.question,
        selectedOption: submittedResponse.selectedOption,
      });
    }

    const validFunction = config.functionOptions.includes(
      participant.function
    );

    if (!validFunction) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid function.",
      });
    }

    const submission = await SelfAssessmentSubmission.create({
      participant: {
        name: String(participant.name).trim(),
        function: String(participant.function).trim(),
        company: String(participant.company).trim(),
        email,
        countryCode: String(participant.countryCode).trim(),
        mobile: String(participant.mobile).trim(),
        website: String(participant.website || "").trim(),
      },

      responses: validatedResponses,

      sourceVideo: {
        videoId: String(sourceVideo?.videoId || "").trim(),
        videoTitle: String(sourceVideo?.videoTitle || "").trim(),
      },

      status: "new",
      isRead: false,

      // Existing background worker will process this record.
      googleSheetsSync: {
        status: "pending",
        attempts: 0,
        nextRetryAt: null,
        lastAttemptAt: null,
        syncedAt: null,
        lastError: "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Your assessment has been submitted successfully.",
      data: {
        submissionId: submission._id,
      },
    });
  } catch (error) {
    console.error("Submit self-assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your assessment.",
    });
  }
};

// ADMIN: Get complete configuration
export const getAdminAssessmentConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Get admin assessment config error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load assessment configuration.",
    });
  }
};

// ADMIN: Update configuration
export const updateAdminAssessmentConfig = async (req, res) => {
  try {
    const { functionOptions, sections } = req.body;

    if (!Array.isArray(functionOptions) || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: "Function options and assessment sections are required.",
      });
    }

    const cleanFunctionOptions = functionOptions
      .map((option) => String(option).trim())
      .filter(Boolean);

    const cleanSections = sections.map((section, index) => {
      if (
        !section.title?.trim() ||
        !section.question?.trim() ||
        !Array.isArray(section.options)
      ) {
        throw new Error(
          `Please provide a title, question and options for section ${index + 1}.`
        );
      }

      return {
        ...(mongoose.Types.ObjectId.isValid(section._id)
          ? { _id: section._id }
          : {}),

        sectionNumber: String(
          section.sectionNumber || index + 1
        ).trim(),

        title: String(section.title).trim(),

        description: String(
          section.description || ""
        ).trim(),

        question: String(section.question).trim(),

        options: section.options
          .map((option) => String(option).trim())
          .filter(Boolean),

        isActive: section.isActive !== false,

        order: Number.isFinite(Number(section.order))
          ? Number(section.order)
          : index + 1,
      };
    });

    const config = await SelfAssessmentConfig.findOneAndUpdate(
      {
        configKey: "manufacturers-self-assessment",
      },
      {
        $set: {
          functionOptions: cleanFunctionOptions,
          sections: cleanSections,
        },
        $setOnInsert: {
          configKey: "manufacturers-self-assessment",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Assessment configuration updated successfully.",
      data: config,
    });
  } catch (error) {
    console.error("Update assessment config error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Unable to update assessment configuration.",
    });
  }
};

// ADMIN: Get submissions with search, filters and pagination
export const getAllSelfAssessmentSubmissions = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      page = 1,
      limit = 10,
    } = req.query;

    if (
      status !== "all" &&
      !VALID_SUBMISSION_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment submission status.",
      });
    }

    const safePage = Math.max(1, Number(page) || 1);

    const safeLimit = Math.min(
      100,
      Math.max(1, Number(limit) || 10)
    );

    const filter = buildAssessmentSearchFilter(search);

    if (status !== "all") {
      filter.status = status;
    }

    const [submissions, total] = await Promise.all([
      SelfAssessmentSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),

      SelfAssessmentSubmission.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      data: submissions,
    });
  } catch (error) {
    console.error("Get assessment submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch assessment submissions.",
    });
  }
};

// ADMIN: Get one submission and mark it as read
export const getSelfAssessmentSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission = await SelfAssessmentSubmission.findById(id);

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
    console.error("Get assessment submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch assessment submission.",
    });
  }
};

// ADMIN: Update submission status
export const updateSelfAssessmentSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    if (!VALID_SUBMISSION_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission status.",
      });
    }

    const submission =
      await SelfAssessmentSubmission.findByIdAndUpdate(
        id,
        { $set: { status } },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assessment submission status updated successfully.",
      data: submission,
    });
  } catch (error) {
    console.error("Update assessment submission status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update assessment submission status.",
    });
  }
};

// ADMIN: Delete a submission
export const deleteSelfAssessmentSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    const submission =
      await SelfAssessmentSubmission.findByIdAndDelete(id);

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
    console.error("Delete assessment submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete submission.",
    });
  }
};
