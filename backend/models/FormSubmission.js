
import mongoose from "mongoose";

export const FORM_TYPES = [
  "contact-us",
  "aia-membership",
  "brochure-enquiry",
  "article-reader",
];

const googleSheetsSyncSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["not_queued", "pending", "processing", "synced", "failed"],
      default: "not_queued",
    },
    attempts: { type: Number, default: 0 },
    nextRetryAt: { type: Date, default: null },
    lastAttemptAt: { type: Date, default: null },
    syncedAt: { type: Date, default: null },
    lastError: { type: String, default: "" },
  },
  { _id: false }
);

const formSubmissionSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      required: true,
      enum: FORM_TYPES,
      index: true,
    },
    sourcePage: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    isRead: { type: Boolean, default: false },

    googleSheetsSync: {
      type: googleSheetsSyncSchema,
      default: () => ({ status: "not_queued" }),
    },
  },
  { timestamps: true, minimize: false }
);

const FormSubmission =
  mongoose.models.FormSubmission ||
  mongoose.model("FormSubmission", formSubmissionSchema);

export default FormSubmission;
