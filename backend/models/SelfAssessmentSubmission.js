
// import mongoose from "mongoose";

// const selfAssessmentSubmissionSchema = new mongoose.Schema(
//   {
//     participant: {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       function: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       company: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//       },
//       countryCode: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       mobile: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       website: {
//         type: String,
//         default: "",
//         trim: true,
//       },
//     },

//     responses: [
//       {
//         sectionId: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//         },
//         sectionNumber: {
//           type: String,
//           default: "",
//         },
//         sectionTitle: {
//           type: String,
//           default: "",
//         },
//         question: {
//           type: String,
//           default: "",
//         },
//         selectedOption: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//       },
//     ],

//     sourceVideo: {
//       videoId: {
//         type: String,
//         default: "",
//       },
//       videoTitle: {
//         type: String,
//         default: "",
//       },
//     },

//     status: {
//       type: String,
//       enum: ["new", "reviewed"],
//       default: "new",
//     },
//   },
//   { timestamps: true }
// );

// const SelfAssessmentSubmission = mongoose.model(
//   "SelfAssessmentSubmission",
//   selfAssessmentSubmissionSchema
// );

// export default SelfAssessmentSubmission;



import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// Individual assessment answer
const assessmentResponseSchema = new Schema(
  {
    sectionId: {
      type: String,
      trim: true,
      required: true,
    },

    sectionNumber: {
      type: String,
      trim: true,
      required: true,
    },

    sectionTitle: {
      type: String,
      trim: true,
      required: true,
    },

    question: {
      type: String,
      trim: true,
      required: true,
    },

    selectedOption: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// Participant information
const assessmentParticipantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    function: {
      type: String,
      trim: true,
      required: true,
    },

    company: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    countryCode: {
      type: String,
      trim: true,
      required: true,
    },

    mobile: {
      type: String,
      trim: true,
      required: true,
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// Source video information
const assessmentSourceVideoSchema = new Schema(
  {
    videoId: {
      type: String,
      trim: true,
      default: "",
    },

    videoTitle: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// Google Sheets synchronization tracking
const googleSheetsSyncSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "failed",
        "synced",
      ],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    nextRetryAt: {
      type: Date,
      default: null,
    },

    lastAttemptAt: {
      type: Date,
      default: null,
    },

    syncedAt: {
      type: Date,
      default: null,
    },

    lastError: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// Main Self-Assessment submission schema
const selfAssessmentSubmissionSchema = new Schema(
  {
    participant: {
      type: assessmentParticipantSchema,
      required: true,
    },

    responses: {
      type: [assessmentResponseSchema],
      required: true,
      validate: {
        validator: function (responses) {
          return Array.isArray(responses) && responses.length === 5;
        },
        message: "Exactly 5 assessment responses are required.",
      },
    },

    sourceVideo: {
      type: assessmentSourceVideoSchema,
      default: () => ({}),
    },

    // CMS submission status
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },

    // Admin read tracking
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Google Sheets background sync
    googleSheetsSync: {
      type: googleSheetsSyncSchema,
      default: () => ({
        status: "pending",
        attempts: 0,
        nextRetryAt: null,
        lastAttemptAt: null,
        syncedAt: null,
        lastError: "",
      }),
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes for admin search and worker processing
selfAssessmentSubmissionSchema.index({
  "participant.name": 1,
});

selfAssessmentSubmissionSchema.index({
  "participant.email": 1,
});

selfAssessmentSubmissionSchema.index({
  "participant.company": 1,
});

selfAssessmentSubmissionSchema.index({
  "googleSheetsSync.status": 1,
  createdAt: 1,
});

const SelfAssessmentSubmission =
  models.SelfAssessmentSubmission ||
  model(
    "SelfAssessmentSubmission",
    selfAssessmentSubmissionSchema
  );

export default SelfAssessmentSubmission;
