import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export const ArticleFeedback =
  mongoose.models.ArticleFeedback ||
  mongoose.model("ArticleFeedback", articleFeedbackSchema);