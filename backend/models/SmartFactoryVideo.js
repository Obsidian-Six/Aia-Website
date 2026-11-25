
import mongoose from "mongoose";

const smartFactoryVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Kept for compatibility with the existing Hero.jsx
    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
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

const SmartFactoryVideo =
  mongoose.models.SmartFactoryVideo ||
  mongoose.model("SmartFactoryVideo", smartFactoryVideoSchema);

export default SmartFactoryVideo;
