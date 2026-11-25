// import mongoose from "mongoose";

// const articleFeedbackSchema = new mongoose.Schema(
//   {
//     article: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Article",
//       required: true,
//       index: true,
//     },

//     articleTitle: {
//       type: String,
//       default: "",
//     },

//     helpful: {
//       type: Boolean,
//       required: true,
//     },

//     wantsToContribute: {
//       type: Boolean,
//       default: null,
//     },

//     contributionEmail: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     comment: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// export const ArticleFeedback =
//   mongoose.models.ArticleFeedback ||
//   mongoose.model("ArticleFeedback", articleFeedbackSchema);



import mongoose from "mongoose";

const googleSheetsSyncSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "not_queued",
        "pending",
        "processing",
        "synced",
        "failed",
      ],
      default: "not_queued",
    },

    attempts: {
      type: Number,
      default: 0,
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
    },
  },
  { _id: false }
);

const articleFeedbackSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },

    articleTitle: {
      type: String,
      default: "",
    },

    articleSlug: {
      type: String,
      default: "",
    },

    articleUrl: {
      type: String,
      default: "",
    },

    helpful: {
      type: Boolean,
      required: true,
    },

    wantsToContribute: {
      type: Boolean,
      default: null,
    },

    contributionEmail: {
      type: String,
      default: "",
      trim: true,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },

    googleSheetsSync: {
      type: googleSheetsSyncSchema,
      default: () => ({
        status: "not_queued",
      }),
    },
  },
  {
    timestamps: true,
  }
);

export const ArticleFeedback =
  mongoose.models.ArticleFeedback ||
  mongoose.model("ArticleFeedback", articleFeedbackSchema);
