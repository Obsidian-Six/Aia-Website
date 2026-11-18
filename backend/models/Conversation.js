
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    expertName: {
      type: String,
      trim: true,
      default: "",
    },

    expertDesignation: {
      type: String,
      trim: true,
      default: "",
    },

    shortDescription: {
      type: String,
      default: "",
    },

    industryVertical: {
      type: String,
      required: true,
      trim: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    audioOriginalName: {
      type: String,
      default: "",
    },

    audioMimeType: {
      type: String,
      default: "",
    },

    audioSize: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    recap: {
      type: String,
      default: "",
    },

    keyTakeaways: {
      type: [String],
      default: [],
    },

    pullQuotes: {
      type: [String],
      default: [],
    },

    memberInsights: {
      type: String,
      default: "",
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);
