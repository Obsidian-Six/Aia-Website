

import mongoose from "mongoose";

const { Schema } = mongoose;
const text = { type: String, default: "" };
const trimmed = { ...text, trim: true };
const imageSchema = new Schema({ url: text, publicId: text }, { _id: false });
const image = { type: imageSchema, default: () => ({}) };

const serviceSchema = new Schema({
  title: trimmed,
  description: text,
  image,
});

const familyMemberSchema = new Schema({
  name: trimmed,
  designation: trimmed,
  organization: trimmed,
  email: trimmed,
  phone: trimmed,
}, { _id: false });

const memberSchema = new Schema({
  name: { type: String, required: true, trim: true },
  shortName: trimmed,
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: trimmed,
  logo: image,
  coverLogo: image,
  about: text,
  services: { type: [serviceSchema], default: [] },
  mission: text,
  vision: text,
  qualityPolicy: text,
  qualityObjectives: { type: [String], default: [] },
  commitment: text,
  familyMember: { type: familyMemberSchema, default: () => ({}) },
  website: trimmed,
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  manufacturingSectors: { type: [String], default: [] },
  technologyStreams: { type: [String], default: [] },
  serviceStreams: { type: [String], default: [] },
  directoryKeywords: { type: [String], default: [] },
}, { timestamps: true });

memberSchema.index({ name: "text", shortName: "text", category: "text" });

export default mongoose.model("Member", memberSchema);
