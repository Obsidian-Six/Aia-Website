
import mongoose from "mongoose";

const assessmentSectionSchema = new mongoose.Schema(
  {
    sectionNumber: {
      type: String,
      required: true,
      trim: true,
    },
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
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const selfAssessmentConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: "manufacturers-self-assessment",
      unique: true,
    },
    functionOptions: [
      {
        type: String,
        trim: true,
      },
    ],
    sections: [assessmentSectionSchema],
  },
  { timestamps: true }
);

const SelfAssessmentConfig = mongoose.model(
  "SelfAssessmentConfig",
  selfAssessmentConfigSchema
);

export default SelfAssessmentConfig;
